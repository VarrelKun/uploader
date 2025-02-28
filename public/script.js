async function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");
    const uploadedImage = document.getElementById("uploadedImage");

    if (fileInput.files.length === 0) {
        status.innerText = "Please select a file!";
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    status.innerText = "Uploading...";
    
    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            status.innerHTML = `✅ Uploaded: <a href="${result.url}" target="_blank">${result.url}</a>`;
            uploadedImage.src = result.url;
            uploadedImage.style.display = "block";
        } else {
            status.innerText = `❌ Error: ${result.error}`;
        }
    } catch (error) {
        status.innerText = "❌ Upload failed!";
    }
}