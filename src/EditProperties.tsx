import {
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { selector, selectorFamily, useRecoilState, useRecoilValue } from "recoil";
import { selectedElementIdState } from "./Canvas";
import { elementState } from "./components/Rectangle/Rectangle";
import _ from "lodash";
import produce from "immer";
import { ImageInfo, ImageInfoFallback } from "./components/ImageInfo";
import { Suspense } from "react";

export const editPropertyState = selectorFamily<any, { path: string; id: number }>({
  key: "editProperty",
  get:
    ({ path, id }) =>
    ({ get }) => {
      const element = get(elementState(id));
      return _.get(element, path);
    },
  set:
    ({ path, id }) =>
    ({ get, set }, newValue) => {
      const element = get(elementState(id));
      const newElement = produce(element, (draft) => {
        _.set(draft, path, newValue);
      });

      set(elementState(id), newElement);
    },
});

export const hasImageState = selector({
  key: "hasImage",
  get: ({ get }) => {
    const id = get(selectedElementIdState);
    if (id === null) return false;

    const element = get(elementState(id));
    return !!element.image;
  },
});

export const editSize = selectorFamily<any, { dimension: "width" | "height"; id: number }>({
  key: "editSize",
  get:
    ({ dimension, id }) =>
    ({ get }) => {
      return get(editPropertyState({ path: `style.size.${dimension}`, id }));
    },
  set:
    ({ dimension, id }) =>
    ({ get, set }, newValue) => {
      const hasImage = !!get(editPropertyState({ path: "image", id }));
      if (!hasImage) {
        set(editPropertyState({ path: `style.size.${dimension}`, id }), newValue);
        return;
      }

      const sizeState = editPropertyState({ path: `style.size`, id });
      const { width, height } = get(sizeState);
      const aspectRatio = width / height;

      if (dimension === "width") {
        set(sizeState, {
          width: newValue,
          height: Math.round(newValue / aspectRatio),
        });
      } else {
        set(sizeState, {
          width: Math.round(newValue * aspectRatio),
          height: newValue,
        });
      }
    },
});

export const EditProperties = () => {
  const selectedElementId = useRecoilValue(selectedElementIdState);
  const hasImage = useRecoilValue(hasImageState);
  if (selectedElementId === null) return null;

  return (
    <Card>
      <Section heading="Position">
        <Property label="Top" path="style.position.top" id={selectedElementId} />
        <Property label="Left" path="style.position.left" id={selectedElementId} />
      </Section>
      <Section heading="Size">
        <SizeProperty label="Width" dimension="width" id={selectedElementId} />
        <SizeProperty label="Height" dimension="height" id={selectedElementId} />
      </Section>
      {hasImage && (
        <Section heading="Image">
          <Suspense fallback={<ImageInfoFallback />}>
            <ImageInfo />
          </Suspense>
        </Section>
      )}
    </Card>
  );
};

const Section: React.FC<{ heading: string }> = ({ heading, children }) => {
  return (
    <VStack spacing={2} align="flex-start">
      <Text fontWeight="500">{heading}</Text>
      {children}
    </VStack>
  );
};

const SizeProperty = ({
  label,
  dimension,
  id,
}: {
  label: string;
  dimension: "width" | "height";
  id: number;
}) => {
  const [prop, setProp] = useRecoilState(editSize({ dimension, id }));
  if (prop === null) return null;

  return <PropertyInput label={label} value={prop} onChange={setProp} />;
};

const Property = ({ label, path, id }: { label: string; path: string; id: number }) => {
  const [prop, setProp] = useRecoilState(editPropertyState({ path, id }));
  if (prop === null) return null;

  return <PropertyInput label={label} value={prop} onChange={setProp} />;
};

const PropertyInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div>
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      <InputGroup size="sm" variant="filled">
        <NumberInput value={value} onChange={(_, value) => onChange(value)}>
          <NumberInputField borderRadius="md" />
          <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
        </NumberInput>
      </InputGroup>
    </div>
  );
};

const Card: React.FC = ({ children }) => (
  <VStack
    position="absolute"
    top="20px"
    right="20px"
    backgroundColor="white"
    padding={2}
    boxShadow="md"
    borderRadius="md"
    spacing={3}
    align="flex-start"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </VStack>
);
