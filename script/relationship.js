import api from "./api.js";

// Cache for person data to avoid multiple API calls
let personCache = new Map();

// Initialize or update the cache
export async function initializePersonCache() {
    try {
        const persons = await api.getAllPersons();
        personCache.clear();
        persons.forEach(person => {
            personCache.set(person.id, person);
        });
    } catch (error) {
        console.error('Error initializing person cache:', error);
        throw error;
    }
}

// Get ancestors up to 3 generations
async function getAncestors(personId, generations = 3) {
    const ancestors = new Set();
    const queue = [{ id: personId, generation: 0 }];

    while (queue.length > 0) {
        const { id, generation } = queue.shift();
        if (generation >= generations) continue;

        const person = personCache.get(id);
        if (!person) continue;

        for (const parentId of person.parentIds) {
            ancestors.add(parentId);
            queue.push({ id: parentId, generation: generation + 1 });
        }
    }

    return ancestors;
}

// Get descendants up to 3 generations
async function getDescendants(personId, generations = 3) {
    const descendants = new Set();
    const queue = [{ id: personId, generation: 0 }];

    while (queue.length > 0) {
        const { id, generation } = queue.shift();
        if (generation >= generations) continue;

        const person = personCache.get(id);
        if (!person) continue;

        for (const childId of person.childrenIds) {
            descendants.add(childId);
            queue.push({ id: childId, generation: generation + 1 });
        }
    }

    return descendants;
}

// Get siblings
function getSiblings(person) {
    const siblings = new Set();
    
    // Get all children of all parents
    for (const parentId of person.parentIds) {
        const parent = personCache.get(parentId);
        if (parent) {
            parent.childrenIds.forEach(childId => {
                if (childId !== person.id) {
                    siblings.add(childId);
                }
            });
        }
    }

    return siblings;
}

// Check relationship between two people
export async function checkRelationship(person1Id, person2Id) {
    if (person1Id === person2Id) {
        return "This is the same person";
    }

    const person1 = personCache.get(person1Id);
    const person2 = personCache.get(person2Id);

    if (!person1 || !person2) {
        throw new Error("One or both persons not found");
    }

    // Check direct relationships first
    if (person1.partnerId === person2Id) {
        return `${person1.name} is partner of ${person2.name}`;
    }

    if (person1.parentIds.includes(person2Id)) {
        return `${person2.name} is parent of ${person1.name}`;
    }

    if (person2.parentIds.includes(person1Id)) {
        return `${person1.name} is parent of ${person2.name}`;
    }

    if (person1.childrenIds.includes(person2Id)) {
        return `${person2.name} is child of ${person1.name}`;
    }

    if (person2.childrenIds.includes(person1Id)) {
        return `${person1.name} is child of ${person2.name}`;
    }

    // Check siblings
    const person1Siblings = getSiblings(person1);
    if (person1Siblings.has(person2Id)) {
        return `${person1.name} is sibling of ${person2.name}`;
    }

    // Check grandparent/grandchild relationship
    const person1Ancestors = await getAncestors(person1Id, 2);
    const person2Ancestors = await getAncestors(person2Id, 2);
    const person1Descendants = await getDescendants(person1Id, 2);
    const person2Descendants = await getDescendants(person2Id, 2);

    if (person1Ancestors.has(person2Id)) {
        return `${person2.name} is grandparent of ${person1.name}`;
    }

    if (person2Ancestors.has(person1Id)) {
        return `${person1.name} is grandparent of ${person2.name}`;
    }

    if (person1Descendants.has(person2Id)) {
        return `${person2.name} is grandchild of ${person1.name}`;
    }

    if (person2Descendants.has(person1Id)) {
        return `${person1.name} is grandchild of ${person2.name}`;
    }

    // Check for relatives within 3 generations
    const person1Extended = new Set([
        ...await getAncestors(person1Id, 3),
        ...await getDescendants(person1Id, 3)
    ]);

    const person2Extended = new Set([
        ...await getAncestors(person2Id, 3),
        ...await getDescendants(person2Id, 3)
    ]);

    // Check if they share any common ancestors or descendants
    const intersection = new Set([...person1Extended].filter(x => person2Extended.has(x)));
    
    if (intersection.size > 0) {
        return `${person1.name} is relative within 3 generations to ${person2.name}`;
    }

    return `${person1.name} is non relative to ${person2.name}`;
}

// Initialize cache when module loads
initializePersonCache();
