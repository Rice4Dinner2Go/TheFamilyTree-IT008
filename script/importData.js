// importData.js

// Hàm tải và xử lý dữ liệu JSON
async function loadFamilyData() {
    try {
        const response = await fetch('log/data.json'); // Đường dẫn tới file JSON
        if (!response.ok) throw new Error("Failed to load JSON file.");

        const data = await response.json();
        renderFamilyTree(data.people);
    } catch (error) {
        console.error("Error loading JSON:", error);
        alert("Could not load family data.");
    }
}

// Hàm xây dựng cây từ dữ liệu JSON
function buildTreeData(people) {
    const peopleMap = new Map();

    // Tạo bản đồ ID thành viên
    people.forEach(person => {
        peopleMap.set(person.id, { ...person, children: [] });
    });

    // Gắn quan hệ cha mẹ và con cái
    people.forEach(person => {
        person.childrenIds.forEach(childId => {
            if (peopleMap.has(childId)) {
                peopleMap.get(person.id).children.push(peopleMap.get(childId));
            }
        });
    });

    // Trả về gốc cây (các thành viên không có cha mẹ)
    return Array.from(peopleMap.values()).filter(person => person.parentsIds.length === 0);
}

// Hàm hiển thị cây phả hệ lên giao diện
function renderTree(root, container) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    node.innerHTML = `
        <div class="tree-name">${root.name} (${root.age} years)</div>
    `;
    container.appendChild(node);

    if (root.children && root.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        root.children.forEach(child => renderTree(child, childrenContainer));
        container.appendChild(childrenContainer);
    }
}

// Hàm chính hiển thị toàn bộ cây phả hệ
function renderFamilyTree(people) {
    const treeData = buildTreeData(people);
    const container = document.getElementById('familyTree');
    container.innerHTML = ''; // Xóa nội dung cũ

    treeData.forEach(root => renderTree(root, container));
}

// Đính kèm sự kiện vào nút
document.getElementById('loadTreeButton').addEventListener('click', loadFamilyData);
