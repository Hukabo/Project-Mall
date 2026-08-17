export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export const transferDate = (date: string) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const optimizeImage = (url: string, width: number, height: number) => {
  return url.replace(
    "/upload/",
    `/upload/c_limit,w_${width},h_${height},q_auto,f_auto/`,
  );
};
