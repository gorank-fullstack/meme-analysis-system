// utils/toast.ts
import { toast } from "sonner";

/**
 * 成功提示（绿色）
 * @param message 提示内容
 */
export const toastSuccess = (message: string) => {
  toast.success(message, {
    className: "gr-toast-success",
  });
};

/**
 * 错误提示（红色） - 严重错误
 * @param message 提示内容
 */
export const toastError = (message: string) => {
  toast.error(message, {
    className: "gr-toast-error",
  });
};

/**
 * 警告提示（橙色） - 非致命的提示，如取消收藏、操作提醒等
 * @param message 提示内容
 */
export const toastWarning = (message: string) => {
  toast.warning(message, {
    className: "gr-toast-warning",
  });
};
