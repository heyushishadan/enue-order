/**
 * 场馆预约系统 - 管理界面脚本
 */

// DOM 加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 侧边栏切换
  initSidebar();

  // 初始化下拉菜单
  initDropdowns();

  // 初始化模态框
  initModals();

  // 初始化表单验证
  initForms();

  // 初始化日期选择器
  initDatepickers();

  // 初始化数据表格
  initDataTables();

  // 初始化图表
  initCharts();

  // 初始化通知
  initNotifications();
});

/**
 * 侧边栏相关功能
 */
function initSidebar() {
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  // 保存侧边栏状态到本地存储
  function saveSidebarState(collapsed) {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }

  // 从本地存储获取侧边栏状态
  function getSidebarState() {
    return localStorage.getItem("sidebarCollapsed") === "true";
  }

  // 初始化时恢复侧边栏状态
  if (getSidebarState() && sidebar) {
    sidebar.classList.add("collapsed");
    mainContent?.classList.add("expanded");
  }

  // 侧边栏切换按钮点击事件
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      mainContent?.classList.toggle("expanded");

      saveSidebarState(sidebar.classList.contains("collapsed"));
    });
  }

  // 移动端菜单切换
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener("click", function () {
      sidebar.classList.toggle("visible");
      document.body.classList.toggle("sidebar-open");
    });

    // 点击内容区域关闭侧边栏
    document.addEventListener("click", function (e) {
      if (
        sidebar.classList.contains("visible") &&
        !sidebar.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        sidebar.classList.remove("visible");
        document.body.classList.remove("sidebar-open");
      }
    });
  }

  // 侧边栏菜单项激活状态
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach(function (item) {
    const link = item.getAttribute("href");
    if (link && currentPath.includes(link)) {
      item.classList.add("active");
    }
  });
}

/**
 * 下拉菜单功能
 */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = this.nextElementSibling;
      if (!dropdown) return;

      // 关闭其他所有下拉菜单
      document.querySelectorAll(".dropdown-menu.show").forEach(function (menu) {
        if (menu !== dropdown) {
          menu.classList.remove("show");
        }
      });

      dropdown.classList.toggle("show");
    });
  });

  // 点击页面其他区域关闭下拉菜单
  document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown-menu.show").forEach(function (menu) {
      menu.classList.remove("show");
    });
  });
}

/**
 * 模态框功能
 */
function initModals() {
  // 打开模态框
  const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      const targetModal = document.querySelector(
        this.getAttribute("data-target")
      );
      if (!targetModal) return;

      targetModal.classList.add("show");
      document.body.classList.add("modal-open");
    });
  });

  // 关闭模态框
  const modalCloseButtons = document.querySelectorAll('[data-dismiss="modal"]');

  modalCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      if (!modal) return;

      modal.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  });

  // 点击模态框背景关闭模态框
  const modals = document.querySelectorAll(".modal");

  modals.forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    });
  });

  // ESC 键关闭模态框
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.show").forEach(function (modal) {
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
      });
    }
  });
}

/**
 * 表单验证功能
 */
function initForms() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  });

  // 自定义的文件上传控件
  const customFileInputs = document.querySelectorAll(".custom-file-input");

  customFileInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      let fileName = this.value.split("\\").pop();
      const label = this.nextElementSibling;
      if (label) {
        label.textContent = fileName || "选择文件";
      }
    });
  });
}

/**
 * 日期选择器初始化
 * 注意：需要引入第三方库，这里只是占位代码
 */
function initDatepickers() {
  const datepickers = document.querySelectorAll(".datepicker");

  if (datepickers.length > 0 && typeof flatpickr !== "undefined") {
    datepickers.forEach(function (el) {
      flatpickr(el, {
        dateFormat: "Y-m-d",
        locale: "zh",
      });
    });
  }
}

/**
 * 数据表格初始化
 * 注意：需要引入第三方库，这里只是占位代码
 */
function initDataTables() {
  const dataTables = document.querySelectorAll(".datatable");

  if (dataTables.length > 0 && typeof $.fn.DataTable !== "undefined") {
    dataTables.forEach(function (table) {
      $(table).DataTable({
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Chinese.json",
        },
        responsive: true,
      });
    });
  }
}

/**
 * 图表初始化
 * 注意：需要引入第三方库，这里只是占位代码
 */
function initCharts() {
  // 访问统计图表
  const visitChart = document.getElementById("visitChart");
  if (visitChart && typeof Chart !== "undefined") {
    new Chart(visitChart, {
      type: "line",
      data: {
        labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        datasets: [
          {
            label: "本周访问量",
            data: [120, 190, 135, 221, 189, 98, 132],
            borderColor: "rgba(59, 130, 246, 1)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // 预约分析图表
  const bookingChart = document.getElementById("bookingChart");
  if (bookingChart && typeof Chart !== "undefined") {
    new Chart(bookingChart, {
      type: "bar",
      data: {
        labels: ["篮球场", "羽毛球场", "足球场", "游泳馆", "健身房"],
        datasets: [
          {
            label: "预约数量",
            data: [89, 121, 56, 78, 102],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(99, 102, 241, 0.7)",
              "rgba(239, 68, 68, 0.7)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

/**
 * 通知功能
 */
function initNotifications() {
  // 获取未读通知数量
  function fetchNotificationCount() {
    // 这里应该是 API 请求，这里用模拟数据
    const count = 5;
    updateNotificationBadge(count);
  }

  // 更新通知徽章数量
  function updateNotificationBadge(count) {
    const badge = document.querySelector(".notification-badge");
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? "99+" : count;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }
  }

  // 标记通知为已读
  function markAsRead(id) {
    console.log("标记通知为已读:", id);
    // 这里应该是 API 请求，通知后端更新状态
  }

  // 通知列表点击事件
  const notifications = document.querySelectorAll(".notification-item");

  notifications.forEach(function (notification) {
    notification.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      if (id) {
        markAsRead(id);
        this.classList.remove("unread");

        // 更新徽章数量
        const badge = document.querySelector(".notification-badge");
        if (badge) {
          let count = parseInt(badge.textContent) - 1;
          updateNotificationBadge(count);
        }
      }
    });
  });

  // 初始化时获取通知数量
  fetchNotificationCount();
}

/**
 * 通用的确认对话框
 * @param {string} message 提示信息
 * @param {Function} callback 确认后的回调函数
 */
function showConfirm(message, callback) {
  if (confirm(message)) {
    if (typeof callback === "function") {
      callback();
    }
  }
}

/**
 * 通用的成功提示
 * @param {string} message 提示信息
 */
function showSuccess(message) {
  alert(message);
}

/**
 * 通用的错误提示
 * @param {string} message 提示信息
 */
function showError(message) {
  alert(message);
}

/**
 * AJAX 请求封装
 * @param {Object} options 请求选项
 */
function ajax(options) {
  const xhr = new XMLHttpRequest();

  xhr.open(options.method || "GET", options.url, true);

  if (options.headers) {
    Object.keys(options.headers).forEach(function (key) {
      xhr.setRequestHeader(key, options.headers[key]);
    });
  }

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        if (typeof options.success === "function") {
          options.success(response);
        }
      } catch (e) {
        if (typeof options.error === "function") {
          options.error(e);
        }
      }
    } else {
      if (typeof options.error === "function") {
        options.error(new Error("请求失败: " + xhr.status));
      }
    }
  };

  xhr.onerror = function () {
    if (typeof options.error === "function") {
      options.error(new Error("网络错误"));
    }
  };

  if (options.data) {
    xhr.send(JSON.stringify(options.data));
  } else {
    xhr.send();
  }
}
