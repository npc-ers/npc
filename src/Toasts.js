
import { toast } from "@zerodevx/svelte-toast";


export function confirmToast(message) {
  toast.push(message, {
    duration: 4000,
    initial: 1,
    next: 0,
    pausable: false,
    dismissable: false,
    reversed: false,
    intro: { x: 256 },
    theme: {
      "--toastBackground": "#48BB78",
      "--toastBarBackground": "#2F855A",
    },
  });
}

export function failToast(message) {
  console.log("fail");
  toast.push(message, {
    duration: 4000,
    initial: 1,
    next: 0,
    pausable: false,
    dismissable: false,
    reversed: false,
    intro: { x: 256 },
    theme: {
      '--toastBackground': '#F56565',
      '--toastBarBackground': '#C53030',
    },
  });
}