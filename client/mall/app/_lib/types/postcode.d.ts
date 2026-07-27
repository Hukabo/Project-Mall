export {};

declare global {
  interface DaumPostcodeData {
    zonecode: string; // 우편번호
    address: string; // 기본 도로명 주소
    roadAddress: string; // 도로명 주소
    jibunAddress: string; // 지번 주소
    buildingName: string; // 건물명
    apartment: "Y" | "N"; // 공동주택 여부
  }

  interface DaumPostcodeOptions {
    oncomplete: (data: DaumPostcodeData) => void;
    onclose?: () => void;
    width?: string | number;
    height?: string | number;
  }

  interface Window {
    daum: {
      Postcode: new (options: DaumPostcodeOptions) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}
