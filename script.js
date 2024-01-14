let imgElement = document.getElementById("imageSrc");
let inputElement = document.getElementById("fileInput");

// 파일 불러오기
inputElement.addEventListener(
    "change",
    (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
    },
    false
);

// 이미지 처리하기
imgElement.onload = function () { // 이미지가 로드되면 함수를 실행해라
    let mat = cv.imread(imgElement);
    cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);
    cv.threshold(mat, mat, 128, 255, cv.THRESH_BINARY);
    cv.imshow("canvasOutput", mat);
    mat.delete();
};

// opencv가 로드되면 알려주는 코드
var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
        document.getElementById("status").innerHTML = "OpenCV.js is ready.";
    },
};