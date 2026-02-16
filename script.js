let imageInput = document.getElementById("imageInput");
const sendBtn = document.getElementById("sendBtn");
const output = document.getElementById("output");
const fileName = document.getElementById("fileName");
const uploadLabel = document.getElementById("uploadLabel");


/* FILE SELECT */
uploadLabel.addEventListener("click", () => {
  imageInput.click();
});


imageInput.addEventListener("change", () => {

  if (imageInput.files.length > 0) {
    fileName.textContent = imageInput.files[0].name;
    uploadLabel.textContent = "✓";
  }

});

/* SEND BUTTON */
sendBtn.addEventListener("click", async () => {

  const file = imageInput.files[0];

  if (!file) {
    alert("Please upload an image");
    return;
  }

  sendBtn.disabled = true;


  /* CREATE CHAT BLOCK */
  const chatBlock = document.createElement("div");
  chatBlock.className = "chat-block";

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.className = "preview-image";

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.textContent = "⏳ Generating caption...";

  chatBlock.appendChild(img);
  chatBlock.appendChild(caption);


  /* ✅ ADD THIS — append to output */
  output.appendChild(chatBlock);


  /* ✅ ADD THIS — auto scroll AFTER image loads */
  img.onload = () => {
    output.scrollTo({
      top: output.scrollHeight,
      behavior: "smooth"
    });
  };


  /* SEND TO BACKEND */
  const formData = new FormData();
  formData.append("file", file);

  try {

    const response = await fetch("http://127.0.0.1:8002/analyze", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    caption.textContent = data.caption || "No caption generated";

    /* ✅ scroll again after caption arrives */
    output.scrollTo({
      top: output.scrollHeight,
      behavior: "smooth"
    });

  } catch (err) {

    caption.textContent = "⚠️ Failed to generate caption.";

    output.scrollTo({
      top: output.scrollHeight,
      behavior: "smooth"
    });

  }


  /* ULTRA-RELIABLE RESET FIX */

  imageInput.remove();

  const newInput = document.createElement("input");
  newInput.type = "file";
  newInput.id = "imageInput";
  newInput.accept = "image/*";
  newInput.hidden = true;

  uploadLabel.appendChild(newInput);

  imageInput = newInput;


  imageInput.addEventListener("change", () => {

    if (imageInput.files.length > 0) {
      fileName.textContent = imageInput.files[0].name;
      uploadLabel.textContent = "✓";
    }

  });


  fileName.textContent = "No file selected";
  uploadLabel.textContent = "+";

  sendBtn.disabled = false;

});

