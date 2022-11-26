import produce from "immer";
import { Suspense } from "react";
import { atomFamily, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedElementIdState } from "../../Canvas";
import { editPropertyState, hasImageState } from "../../EditProperties";
import { Drag } from "../Drag";
import { Resize } from "../Resize";
import { RectangleContainer } from "./RectangleContainer";
import { RectangleInner } from "./RectangleInner";
import { RectangleLoading } from "./RectangleLoading";

export type ElementStyle = {
  position: { top: number; left: number };
  size: { width: number; height: number };
};

export type Element = {
  style: ElementStyle;
  image?: {
    id: number;
    src: string;
  };
};

export const defaultElement = {
  style: {
    position: { top: 100, left: 100 },
    size: { width: 100, height: 100 },
  },
};

export const elementState = atomFamily<Element, number>({
  key: "element",
  default: defaultElement,
});

export const Rectangle = ({ id }: { id: number }) => {
  const [selectedElement, setSelectedElement] = useRecoilState(selectedElementIdState);
  const element = useRecoilValue(elementState(id));
  const hasImage = useRecoilValue(hasImageState);
  const setPosition = useSetRecoilState(editPropertyState({ path: "style.position", id }));
  const setStyle = useSetRecoilState(editPropertyState({ path: "style", id }));

  return (
    // @ts-ignore
    <RectangleContainer
      position={element.style.position}
      size={element.style.size}
      onSelect={() => {
        setSelectedElement(id);
      }}
    >
      {/* @ts-ignore */}
      <Resize
        selected={id === selectedElement}
        position={element.style.position}
        size={element.style.size}
        onResize={setStyle}
        keepAspectRatio={hasImage}
      >
        {/* @ts-ignore */}
        <Drag position={element.style.position} onDrag={setPosition}>
          <div>
            <Suspense fallback={<RectangleLoading selected={id === selectedElement} />}>
              <RectangleInner selected={id === selectedElement} id={id} />
            </Suspense>
          </div>
        </Drag>
      </Resize>
    </RectangleContainer>
  );
};
