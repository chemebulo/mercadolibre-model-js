export type Page<T> = {
  amountOfPages: number,
  currentPage: number,
  items: T[],
  amountOfElements: number
};

export const getPage = <T>(list: T[], page: number): Page<T> => {
  if(page < 1) throw new Error("Page must be 1 or more");
  const chunkSize = 15;
  const chunkedList = [];
  for(let i = 0; i < list.length; i += chunkSize) {
    chunkedList.push(list.slice(i, i + chunkSize));
  }
  return {
    currentPage: page,
    items: chunkedList[page - 1] || [],

    amountOfElements: list.length,
    amountOfPages: chunkedList.length,
  }
}
