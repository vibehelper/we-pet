// WePet 宠物医院门户 — 前端交互
// 预约表单：校验 + 本地保存（localStorage），无后端，仅演示

(function () {
  var STORAGE_KEY = "wepet_bookings";

  // 移动端导航
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mainNav.classList.remove("open"); });
    });
  }

  // FAQ 手风琴
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    q.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (i) {
        i.classList.remove("open");
      });
      if (!wasOpen) item.classList.add("open");
    });
  });

  // 预约日期不早于今天
  var dateInput = document.getElementById("bookDate");
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = yyyy + "-" + mm + "-" + dd;
  }

  // 已有预约展示
  function loadBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function renderBookings() {
    var box = document.getElementById("myBookings");
    if (!box) return;
    var list = loadBookings();
    if (!list.length) { box.innerHTML = ""; return; }
    box.innerHTML = "<h3>我的预约</h3>" + list.slice(-3).reverse().map(function (b) {
      return '<div class="my-booking"><strong>' + b.petName + "（" + b.petType + "）</strong> · " +
        b.dept + "<br>" + b.date + " " + b.time + " · 预约号 " + b.no + "</div>";
    }).join("");
  }

  renderBookings();

  // 提交预约
  var form = document.getElementById("bookingForm");
  var success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phone = document.getElementById("ownerPhone").value.trim();
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert("请填写正确的 11 位手机号");
        return;
      }
      var list = loadBookings();
      var no = "WP" + Date.now().toString().slice(-8);
      var booking = {
        no: no,
        petName: document.getElementById("petName").value.trim(),
        petType: document.getElementById("petType").value,
        dept: document.getElementById("dept").value,
        date: document.getElementById("bookDate").value,
        time: document.getElementById("bookTime").value,
        owner: document.getElementById("ownerName").value.trim()
      };
      list.push(booking);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      success.hidden = false;
      success.textContent = "预约成功！预约号 " + no + "，我们会短信通知 " + booking.owner +
        "（" + booking.date + " " + booking.time + "，" + booking.dept + "）。请提前 10 分钟到院。";
      form.reset();
      renderBookings();
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
