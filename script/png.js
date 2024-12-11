document.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("download");
  const element = document.getElementById("familyTree");

  downloadButton.addEventListener("click", async () => {
    // Sử dụng html2canvas để chụp phần tử
    html2canvas(element).then((canvas) => {
      // Chuyển canvas thành hình ảnh PNG
      const imageData = canvas.toDataURL("image/png");

      // Tạo link tải
      const link = document.createElement("a");
      link.download = "family_tree.png";
      link.href = imageData;
      link.click();
    });
  });
});
