document.addEventListener('DOMContentLoaded', function() {
    // 读取配置
    const config = window.REDIRECT_CONFIG || {};
    const rulesIntermediate = window.RULES_INTERMEDIATE || {};
    const rulesDirect = window.RULES_DIRECT || {};
    const fallbackBase = config.fallback || "https://blog.acofork.com";

    // 获取当前路径
    const path = window.location.pathname;
    
    // 处理路径匹配 (移除末尾的斜杠，除非是根路径)
    let lookupPath = path;
    if (path.length > 1 && path.endsWith('/')) {
        lookupPath = path.slice(0, -1);
    }

    // 辅助函数：解析规则值 (支持字符串或对象)
    function getRuleData(ruleValue) {
        if (typeof ruleValue === 'string') {
            return { url: ruleValue };
        } else if (typeof ruleValue === 'object' && ruleValue !== null) {
            return ruleValue;
        }
        return null;
    }

    // 查找规则
    // 优先级: 1. 直接跳转 (Direct) 2. 中间页跳转 (Intermediate) 3. Fallback
    
    let target = null;
    let mode = 'fallback'; // direct, intermediate, fallback
    let ruleData = null;

    // 只要规则存在，就视为命中（过期逻辑由后端处理，后端会删除过期条目）
    if (rulesDirect[lookupPath]) {
        ruleData = getRuleData(rulesDirect[lookupPath]);
        if (ruleData) {
            target = ruleData.url;
            mode = 'direct';
        }
    } 
    
    // 如果没有命中 Direct 规则，继续检查 Intermediate
    if (!target && rulesIntermediate[lookupPath]) {
        ruleData = getRuleData(rulesIntermediate[lookupPath]);
        if (ruleData) {
            target = ruleData.url;
            mode = 'intermediate';
        }
    }
    
    // 如果仍然没有目标，使用 Fallback
    if (!target) {
        // Fallback
        let base = fallbackBase;
        if (base.endsWith('/') && path.startsWith('/')) {
            base = base.slice(0, -1);
        } else if (!base.endsWith('/') && !path.startsWith('/')) {
            base = base + '/';
        }
        target = base + path;
        mode = 'direct'; 
    }

    // URL 构建逻辑
    const search = window.location.search;
    const hash = window.location.hash;
    let finalUrl = target;

    try {
        const url = new URL(target);
        const currentParams = new URLSearchParams(search);
        currentParams.forEach((value, key) => {
            url.searchParams.set(key, value);
        });
        if (hash) {
            url.hash = hash;
        }
        finalUrl = url.toString();
    } catch (e) {
        console.error("Invalid URL construction", e);
        finalUrl = target + search + hash;
    }

    // 执行逻辑
    if (mode === 'direct') {
        // 直接跳转
        // 显示 Loading...
        const urlDisplay = document.getElementById('url-display');
        if (urlDisplay) urlDisplay.textContent = "Redirecting to " + finalUrl;
        window.location.replace(finalUrl);
    } else {
        // 中间页 (intermediate)
        // 更新 UI
        const urlDisplay = document.getElementById('url-display');
        const redirectLink = document.getElementById('redirect-link');
        const card = document.querySelector('.card');

        // 显示卡片 (如果有 hidden 类的话，这里可以移除)
        if (card) card.style.display = 'block';

        if (urlDisplay) {
            urlDisplay.textContent = finalUrl;
        }

        if (redirectLink) {
            redirectLink.href = finalUrl;
        }
    }
});
