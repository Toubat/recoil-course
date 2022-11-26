import { createContext, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { Element, Rectangle } from "./components/Rectangle/Rectangle";
import { EditProperties } from "./EditProperties";
import { PageContainer } from "./PageContainer";
import { Toolbar } from "./Toolbar";

export const selectedElementIdState = atom<number | null>({
  key: "selectedElementId",
  default: null,
});

export const elementsState = atom<number[]>({
  key: "elements",
  default: [],
});

export type SetElement = (indexToSet: number, newElement: Element) => void;

function Canvas() {
  const elements = useRecoilValue(elementsState);
  const setSelectedElement = useSetRecoilState(selectedElementIdState);

  return (
    <PageContainer
      onClick={() => {
        setSelectedElement(null);
      }}
    >
      <Toolbar />
      <EditProperties />
      {elements.map((id) => (
        <Rectangle key={id} id={id} />
      ))}
    </PageContainer>
  );
}

export default Canvas;
