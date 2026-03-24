let currentWordData = null;

// ترجمة الكلمة عبر Langbly
async function translateLangbly(text, targetLang, sourceLang = "es") {
  const API_KEY = "YOUR_API_KEY_HERE"; // حط هنا الـ Key تبعك
  const BASE_URL = "https://api.langbly.com/language/translate/v2";

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer UHmbUQivVPBQcdmED62Ma1`
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text"
      })
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
}

// البحث عن الكلمة
async function searchWord() {
  const word = document.getElementById("wordInput").value;
  const lang = document.getElementById("languageSelect").value;
  if (!word) return;

  const translated = await translateLangbly(word, lang);

  currentWordData = {
    word: word,
    meaning: translated || "Translation failed"
  };

  document.getElementById("result").innerText =
    `${currentWordData.word} = ${currentWordData.meaning}`;
}

// حفظ الكلمة
function saveWord() {
  if (!currentWordData) return;

  let saved = JSON.parse(localStorage.getItem("words")) || [];
  saved.push(currentWordData);
  localStorage.setItem("words", JSON.stringify(saved));

  displaySavedWords();
}

// عرض الكلمات المحفوظة
function displaySavedWords() {
  let saved = JSON.parse(localStorage.getItem("words")) || [];
  const list = document.getElementById("savedList");
  list.innerHTML = "";

  saved.forEach((w, index) => {
    const li = document.createElement("li");
    li.innerText = `${w.word} = ${w.meaning}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => {
      saved.splice(index, 1);
      localStorage.setItem("words", JSON.stringify(saved));
      displaySavedWords();
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// ربط الأزرار بعد تحميل الصفحة
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", searchWord);
  document.getElementById("saveBtn").addEventListener("click", saveWord);
  displaySavedWords();
});

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();
  const result = data.slice(1).map(row => ({
    word: row[0],
    meaning: row[1],
    language: row[2],
    date: row[3]
  }));
  return ContentService.createTextOutput(JSON.stringify(result))
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const params = JSON.parse(e.postData.contents);

  sheet.appendRow([params.word, params.meaning, params.language, new Date()]);

  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
                       .setMimeType(ContentService.MimeType.JSON);
}