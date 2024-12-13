let jsonData = null;

function importFromJson() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';  

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];  
        if (file) {
            const reader = new FileReader();  
            reader.onload = function(e) {
                try {
                    jsonData = JSON.parse(e.target.result);  
                    console.log("Dữ liệu JSON đã được tải lên:", jsonData);
                    alert("Dữ liệu JSON đã được tải lên thành công!"); 
                } catch (error) {
                    console.error("Lỗi khi phân tích dữ liệu JSON:", error);
                    alert("Đã xảy ra lỗi khi phân tích dữ liệu JSON.");
                }
            };

            reader.readAsText(file);  
        }
    });

    fileInput.click();
}
