// 场馆预约系统 - 主JavaScript文件

// 等待DOM加载完成
document.addEventListener("DOMContentLoaded", function () {
  // 设置当前时间
  updateTime();
  setInterval(updateTime, 60000); // 每分钟更新一次

  // 导航栏返回按钮功能
  setupBackButtons();

  // 底部标签栏切换功能
  setupTabBar();

  // 初始化表单验证
  setupFormValidation();

  // 初始化搜索功能
  setupSearch();

  // 初始化图片轮播
  setupCarousel();

  // 初始化日期选择器
  setupDatePickers();

  // 初始化场馆预约
  setupBooking();
});

// 更新状态栏时间
function updateTime() {
  const timeElements = document.querySelectorAll(".ios-status-bar .time");
  if (timeElements.length > 0) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    timeElements.forEach((element) => {
      element.textContent = `${hours}:${minutes}`;
    });
  }
}

// 设置返回按钮功能
function setupBackButtons() {
  const backButtons = document.querySelectorAll(
    '.left-button[data-action="back"]'
  );
  backButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const target = this.getAttribute("data-target");
      if (target) {
        window.location.href = target;
      } else {
        window.history.back();
      }
    });
  });
}

// 设置底部标签栏功能
function setupTabBar() {
  const tabItems = document.querySelectorAll(".ios-tab-bar .tab-item");
  tabItems.forEach((item) => {
    item.addEventListener("click", function () {
      const target = this.getAttribute("data-target");
      if (target) {
        // 先移除所有活动状态
        tabItems.forEach((tab) => tab.classList.remove("active"));
        // 为当前点击的添加活动状态
        this.classList.add("active");
        // 跳转到目标页面
        window.location.href = target;
      }
    });
  });

  // 根据当前页面激活对应的标签
  const currentPath = window.location.pathname;
  tabItems.forEach((item) => {
    const target = item.getAttribute("data-target");
    if (target && currentPath.includes(target)) {
      item.classList.add("active");
    }
  });
}

// 设置表单验证功能
function setupFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');
  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      let isValid = true;

      // 验证必填字段
      const requiredFields = this.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("border-red-500");
          // 找到相关的错误消息并显示
          const errorMsg = document.getElementById(`${field.id}-error`);
          if (errorMsg) {
            errorMsg.classList.remove("hidden");
          }
        } else {
          field.classList.remove("border-red-500");
          const errorMsg = document.getElementById(`${field.id}-error`);
          if (errorMsg) {
            errorMsg.classList.add("hidden");
          }
        }
      });

      // 验证邮箱格式
      const emailFields = this.querySelectorAll('input[type="email"]');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailFields.forEach((field) => {
        if (field.value.trim() && !emailRegex.test(field.value)) {
          isValid = false;
          field.classList.add("border-red-500");
          const errorMsg = document.getElementById(`${field.id}-format-error`);
          if (errorMsg) {
            errorMsg.classList.remove("hidden");
          }
        } else if (field.value.trim()) {
          const errorMsg = document.getElementById(`${field.id}-format-error`);
          if (errorMsg) {
            errorMsg.classList.add("hidden");
          }
        }
      });

      // 验证密码匹配
      const password = this.querySelector('input[name="password"]');
      const confirmPassword = this.querySelector(
        'input[name="confirmPassword"]'
      );
      if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
      ) {
        isValid = false;
        confirmPassword.classList.add("border-red-500");
        const errorMsg = document.getElementById(
          `${confirmPassword.id}-match-error`
        );
        if (errorMsg) {
          errorMsg.classList.remove("hidden");
        }
      } else if (password && confirmPassword) {
        const errorMsg = document.getElementById(
          `${confirmPassword.id}-match-error`
        );
        if (errorMsg) {
          errorMsg.classList.add("hidden");
        }
      }

      // 如果表单验证失败，阻止提交
      if (!isValid) {
        event.preventDefault();
      } else {
        // 表单验证成功，如果有重定向目标，则跳转
        const redirectTo = this.getAttribute("data-redirect");
        if (redirectTo) {
          event.preventDefault();
          window.location.href = redirectTo;
        }
      }
    });
  });
}

// 设置搜索功能
function setupSearch() {
  const searchInputs = document.querySelectorAll(".ios-search-bar input");
  searchInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();
      const resultsContainer = document.querySelector(
        this.getAttribute("data-results")
      );

      if (!resultsContainer) return;

      const items = resultsContainer.querySelectorAll(".searchable-item");
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (searchTerm === "" || text.includes(searchTerm)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });

      // 显示/隐藏"无搜索结果"信息
      const noResults = document.querySelector(".no-results");
      if (noResults) {
        let hasVisibleItems = false;
        items.forEach((item) => {
          if (item.style.display !== "none") {
            hasVisibleItems = true;
          }
        });

        if (!hasVisibleItems && searchTerm !== "") {
          noResults.classList.remove("hidden");
        } else {
          noResults.classList.add("hidden");
        }
      }
    });
  });
}

// 设置图片轮播功能
function setupCarousel() {
  const carousels = document.querySelectorAll(".ios-carousel");
  carousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll(".ios-carousel-slide");
    const dots = carousel.querySelectorAll(".ios-carousel-dot");
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoplayInterval;

    // 显示指定幻灯片
    function showSlide(index) {
      // 确保索引在有效范围内
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      // 更新当前幻灯片索引
      currentSlide = index;

      // 隐藏所有幻灯片并显示当前幻灯片
      slides.forEach((slide, i) => {
        slide.style.display = i === currentSlide ? "block" : "none";
      });

      // 更新指示器状态
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    }

    // 设置自动播放
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 3000); // 每3秒切换一次
    }

    // 停止自动播放
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // 初始化显示第一张幻灯片
    showSlide(0);

    // 如果有多张幻灯片，启动自动播放
    if (totalSlides > 1) {
      startAutoplay();
    }

    // 点击指示器切换幻灯片
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopAutoplay(); // 用户交互时停止自动播放
        showSlide(i);
        startAutoplay(); // 重新开始自动播放
      });
    });
  });
}

// 设置日期选择器功能
function setupDatePickers() {
  const datePickers = document.querySelectorAll(".ios-date-picker");
  datePickers.forEach((picker) => {
    const dateInput = picker.querySelector('input[type="date"]');
    const displayElement = picker.querySelector(".date-display");

    if (dateInput && displayElement) {
      // 初始化显示
      if (dateInput.value) {
        const date = new Date(dateInput.value);
        displayElement.textContent = formatDateForDisplay(date);
      }

      // 日期变更时更新显示
      dateInput.addEventListener("change", function () {
        const date = new Date(this.value);
        displayElement.textContent = formatDateForDisplay(date);

        // 触发自定义事件
        const event = new CustomEvent("dateSelected", {
          detail: { date: date },
        });
        picker.dispatchEvent(event);
      });
    }
  });
}

// 格式化日期为显示格式
function formatDateForDisplay(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  return date.toLocaleDateString("zh-CN", options);
}

// 设置场馆预约功能
function setupBooking() {
  // 时段选择
  const timeSlots = document.querySelectorAll(".time-slot");
  timeSlots.forEach((slot) => {
    slot.addEventListener("click", function () {
      // 检查是否可预约
      if (this.classList.contains("unavailable")) {
        return;
      }

      // 切换选中状态
      this.classList.toggle("selected");

      // 更新表单字段
      const selectedSlotsInput = document.getElementById("selectedSlots");
      if (selectedSlotsInput) {
        const selectedSlots = Array.from(
          document.querySelectorAll(".time-slot.selected")
        ).map((slot) => slot.getAttribute("data-slot-id"));
        selectedSlotsInput.value = selectedSlots.join(",");
      }

      // 更新预约摘要
      updateBookingSummary();
    });
  });

  // 更新预约摘要
  function updateBookingSummary() {
    const summaryElement = document.querySelector(".booking-summary");
    if (!summaryElement) return;

    const selectedSlots = document.querySelectorAll(".time-slot.selected");
    const venue = document.querySelector(".venue-name")?.textContent || "";
    const date = document.querySelector(".selected-date")?.textContent || "";

    // 更新摘要内容
    let html = "";
    if (selectedSlots.length > 0) {
      html += `<div class="ios-mb-2"><strong>场馆:</strong> ${venue}</div>`;
      html += `<div class="ios-mb-2"><strong>日期:</strong> ${date}</div>`;
      html += `<div class="ios-mb-2"><strong>时段:</strong></div>`;
      html += '<ul class="ios-mb-3">';

      selectedSlots.forEach((slot) => {
        const time = slot.querySelector(".time")?.textContent || "";
        const price = slot.querySelector(".price")?.textContent || "";
        html += `<li>${time} - ${price}</li>`;
      });

      html += "</ul>";

      // 计算总价
      const total = Array.from(selectedSlots).reduce((sum, slot) => {
        const priceText = slot.querySelector(".price")?.textContent || "0元";
        const price =
          parseFloat(priceText.replace("￥", "").replace("元", "")) || 0;
        return sum + price;
      }, 0);

      html += `<div class="ios-mt-3"><strong>总价:</strong> ￥${total.toFixed(
        2
      )}</div>`;
    } else {
      html = '<div class="ios-text-center ios-text-gray">请选择预约时段</div>';
    }

    summaryElement.innerHTML = html;
  }

  // 场地选择
  const courtOptions = document.querySelectorAll(".court-option");
  courtOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // 移除其他选项的选中状态
      courtOptions.forEach((opt) => opt.classList.remove("selected"));
      // 添加当前选项的选中状态
      this.classList.add("selected");

      // 更新表单字段
      const selectedCourtInput = document.getElementById("selectedCourt");
      if (selectedCourtInput) {
        selectedCourtInput.value = this.getAttribute("data-court-id");
      }
    });
  });
}

// 在指定元素上显示加载中动画
function showLoading(element) {
  element.innerHTML = `
        <div class="ios-flex-center ios-py-4">
            <div class="ios-spinner"></div>
            <span class="ios-ml-2">加载中...</span>
        </div>
    `;
}

// 消息弹出框
function showAlert(title, message, onConfirm, showCancel = false) {
  // 创建弹窗元素
  const alertElement = document.createElement("div");
  alertElement.className = "ios-alert-overlay";
  alertElement.innerHTML = `
        <div class="ios-alert">
            <div class="ios-alert-title">${title}</div>
            <div class="ios-alert-message">${message}</div>
            <div class="ios-alert-actions">
                ${
                  showCancel
                    ? '<button class="ios-alert-button cancel">取消</button>'
                    : ""
                }
                <button class="ios-alert-button confirm">确定</button>
            </div>
        </div>
    `;

  // 添加到body
  document.body.appendChild(alertElement);

  // 绑定事件
  const confirmButton = alertElement.querySelector(".confirm");
  confirmButton.addEventListener("click", function () {
    document.body.removeChild(alertElement);
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  });

  const cancelButton = alertElement.querySelector(".cancel");
  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      document.body.removeChild(alertElement);
    });
  }
}

// 模拟异步请求
function simulateRequest(successData, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(successData);
    }, delay);
  });
}
