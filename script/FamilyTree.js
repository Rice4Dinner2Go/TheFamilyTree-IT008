// Chương trình vẽ cây gia phả, theo dữ liệu từ file data.json
import api from "./api.js";

var rootId = "0";
var family;

async function loadFamilyData() {
    try {
        const data = await api.getAllPersons();
        if (rootId === "0" && data.length > 0){
            rootId = data[0].id;
        }
        console.log(rootId);
        return data;
    } catch (error) {
        console.error('Error loading data.json:', error);
        return [];
    }
}

function findPerson(people, id) {
    return people.find(person => person.id === id);
}

function createPersonElement(person, isRoot = false) {
    const div = document.createElement('div');
    div.className = `person ${person.gender.toLowerCase()} ${isRoot ? 'root' : ''}`;
    div.dataset.id = person.id;
    div.innerHTML = `
        <h3>${person.name}</h3>
        <p>${person.age} years</p>
    `;
    return div;
}

function findPartnerPairs(people) {
    const pairs = [];
    people.forEach(person => {
        if (person.partnerId) {
            const partner = findPerson(people, person.partnerId);
            if (partner && !pairs.some(pair => 
                pair.includes(person.id) || pair.includes(partner.id)
            )) {
                pairs.push([person.id, partner.id]);
            }
        }
    });
    return pairs;
}

function drawPartnerConnection(svg, person1El, person2El, containerRect) {
    if (!person1El || !person2El) return null;

    const rect1 = person1El.getBoundingClientRect();
    const rect2 = person2El.getBoundingClientRect();

    const x1 = (rect1.left + rect1.right) / 2 - containerRect.left;
    const x2 = (rect2.left + rect2.right) / 2 - containerRect.left;
    const y = rect1.top + rect1.height / 2 - containerRect.top;

    const partnerLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    partnerLine.setAttribute('x1', x1);
    partnerLine.setAttribute('y1', y);
    partnerLine.setAttribute('x2', x2);
    partnerLine.setAttribute('y2', y);
    partnerLine.setAttribute('class', 'partner-line');
    svg.appendChild(partnerLine);

    return {
        x1, x2, y,
        centerX: (x1 + x2) / 2
    };
}

function drawChildrenConnections(svg, parentConnection, childrenEls, containerRect) {
    if (!parentConnection || childrenEls.length === 0) return;

    const { centerX, y: parentY } = parentConnection;

    // Bắt đầu vẽ đường nhánh đến con cái, bắt đầu tại chính giữa đường nối phụ huynh
    const firstChildRect = childrenEls[0].getBoundingClientRect();
    const lastChildRect = childrenEls[childrenEls.length - 1].getBoundingClientRect();
    const firstChildY = firstChildRect.top - containerRect.top;
    const verticalMidpoint = parentY + (firstChildY - parentY) / 2;

    // Từ chính giữa đường nối phụ huynh, kẻ 1 đường thẳng xuống, ngắn
    const mainVerticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    mainVerticalLine.setAttribute('x1', centerX);
    mainVerticalLine.setAttribute('y1', parentY);
    mainVerticalLine.setAttribute('x2', centerX);
    mainVerticalLine.setAttribute('y2', verticalMidpoint);
    mainVerticalLine.setAttribute('class', 'child-line');
    svg.appendChild(mainVerticalLine);

    // Từ đường kẻ xuuống ngắn đóm rẽ nhánh ra các con
    childrenEls.forEach(childEl => {
        const childRect = childEl.getBoundingClientRect();
        const childX = (childRect.left + childRect.right) / 2 - containerRect.left;
        const childY = childRect.top - containerRect.top;

        // Từ các nhánh, kẻ xuống con
        const childVerticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        childVerticalLine.setAttribute('x1', childX);
        childVerticalLine.setAttribute('y1', verticalMidpoint);
        childVerticalLine.setAttribute('x2', childX);
        childVerticalLine.setAttribute('y2', childY);
        childVerticalLine.setAttribute('class', 'child-line');
        svg.appendChild(childVerticalLine);

        // Nối cacs đường kẻ xuống đó lại bằng 1 đường ngang dài
        const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        horizontalLine.setAttribute('x1', centerX);
        horizontalLine.setAttribute('y1', verticalMidpoint);
        horizontalLine.setAttribute('x2', childX);
        horizontalLine.setAttribute('y2', verticalMidpoint);
        horizontalLine.setAttribute('class', 'child-line');
        svg.appendChild(horizontalLine);
    });
}

function drawConnections(container, people, root, partner, children) {
    const connectionsDiv = document.createElement('div');
    connectionsDiv.className = 'connections';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    //Vẽ các mối quan hệ cho cá nhân 'people'
    setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        const partnerPairs = findPartnerPairs(people);

        // Vẽ vợ, chồng
        const partnerConnections = new Map();
        partnerPairs.forEach(([person1Id, person2Id]) => {
            const person1El = container.querySelector(`[data-id="${person1Id}"]`);
            const person2El = container.querySelector(`[data-id="${person2Id}"]`);
            const connection = drawPartnerConnection(svg, person1El, person2El, containerRect);
            if (connection) {
                partnerConnections.set(person1Id, connection);
                partnerConnections.set(person2Id, connection);
            }
        });

        // Vẽ con cái
        people.forEach(person => {
            const parentConnection = partnerConnections.get(person.id);
            if (parentConnection && person.childrenIds.length > 0) {
                const childrenEls = person.childrenIds
                    .map(childId => container.querySelector(`[data-id="${childId}"]`))
                    .filter(el => el);
                drawChildrenConnections(svg, parentConnection, childrenEls, containerRect);
            }
        });
    }, 0);

    connectionsDiv.appendChild(svg);
    return connectionsDiv;
}
// Hàm cập nhật thông tin trong panel bên phải
function updateInfoPanel(person) {
    document.getElementById('info-name').textContent = person.name;
    document.getElementById('info-age').textContent = person.age;
    document.getElementById('info-birthday').textContent = person.dateOfBirth || "Unknown";
    document.getElementById('info-gender').textContent = person.gender === "Male" ? "Male" : "Female";
}
  // Hàm để xử lý khi người dùng click vào một cá nhân
function handlePersonClick(personId) {
rootId = personId;
drawFamilyTree();
}

// Hàm vẽ cây gia phả với root mới
async function drawFamilyTree() {
    if (!family){
        family = await loadFamilyData();
    }
    const treeContainer = document.getElementById('familyTree');
    treeContainer.innerHTML = ""; // Xóa cây cũ

    try {
        const root = await api.getPersonById(rootId);
        if (!root) {
            console.error("Không tìm thấy người làm gốc với ID:", rootId);
            return;
        }

        // Cập nhật thông tin trong panel
        updateInfoPanel(root);

        // Layer -1: Ông bà (Cha mẹ của root)
        const parentsLayer = document.createElement('div');
        parentsLayer.className = 'layer';
        const parents = await api.getParents(rootId);
        if (parents && parents.length > 0) {
            for (const parent of parents) {
                const parentEl = createPersonElement(parent);
                parentEl.addEventListener("click", () => handlePersonClick(parent.id));
                parentsLayer.appendChild(parentEl);
            }
            treeContainer.appendChild(parentsLayer);
        }

        // Layer 0: Root, anh em, vợ chồng
        const currentLayer = document.createElement('div');
        currentLayer.className = 'layer';

        // Add root person
        const rootEl = createPersonElement(root, true);
        rootEl.addEventListener("click", () => handlePersonClick(root.id));
        currentLayer.appendChild(rootEl);

        // Add partner if exists
        if (root.partnerId) {
            const partner = await api.getPersonById(root.partnerId);
            if (partner) {
                const partnerEl = createPersonElement(partner);
                partnerEl.addEventListener("click", () => handlePersonClick(partner.id));
                currentLayer.appendChild(partnerEl);
            }
        }
        treeContainer.appendChild(currentLayer);

        // Layer 1: Children
        if (root.childrenIds && root.childrenIds.length > 0) {
            const childrenLayer = document.createElement('div');
            childrenLayer.className = 'layer';
            const children = await Promise.all(
                root.childrenIds.map(id => api.getPersonById(id))
            );
            for (const child of children) {
                if (child) {
                    const childEl = createPersonElement(child);
                    childEl.addEventListener("click", () => handlePersonClick(child.id));
                    childrenLayer.appendChild(childEl);
                }
            }
            treeContainer.appendChild(childrenLayer);
        }

        // Draw connections
        const connections = drawConnections(treeContainer, family, root);
        treeContainer.appendChild(connections);
    } catch (error) {
        console.error("Error drawing family tree:", error);
    }
}

drawFamilyTree();