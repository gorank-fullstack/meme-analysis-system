"use strict";

(() => {
  // 判空辅助：null 或 undefined 视为“空”
  const isNil = (v) => v == null;
  const isDef = (v) => !isNil(v);

  (function () {
    /**
     * 创建 Moralis 价格图表小部件
     * @param {string} elementId - 容器元素的 id
     * @param {Object} opts - 参数对象（会被序列化拼到 URL 上）
     *  特殊字段：
     *    - autoSize: boolean   自动宽高 100%
     *    - width: string       iframe 宽度（如 "600px" 或 "100%"）
     *    - height: string      iframe 高度（如 "400px" 或 "100%"）
     *    - 其它字段会作为查询参数传给 /widgets/embed/price-chart
     */
    function createMyWidget(elementId, opts) {
      const container = document.getElementById(elementId);
      if (!container) return;

      const base = "https://widget.moralis.com";

      // 清空容器
      container.innerHTML = "";

      // 组装查询参数（过滤掉 null/undefined，非字符串的值转 JSON 字符串）
      const paramsObj = Object.fromEntries(
        Object.entries({
          ...opts,
          pageUrl: window.location.href,
        })
          .filter(([, v]) => isDef(v))
          .map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
      );

      // 计算 iframe 宽高
      const height = opts.autoSize ? "100%" : opts.height || "100%";
      const width = opts.autoSize ? "100%" : opts.width || "100%";

      // 序列化查询串
      const qs = new URLSearchParams(paramsObj).toString();

      // 创建 iframe
      const iframe = document.createElement("iframe");
      iframe.id = "my-widget-iframe";
      iframe.src = `${base}/widgets/embed/price-chart?${qs}`;
      iframe.style.width = width;
      iframe.style.height = height;
      iframe.style.border = "none";
      iframe.style.overflow = "hidden";
      iframe.style.flex = "1";
      iframe.style.display = "flex";
      iframe.style.flexDirection = "column";

      // 挂载
      container.appendChild(iframe);
    }

    // 暴露到全局
    window.createMyWidget = createMyWidget;
  })();
})();
