import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  NumberInput,
  NumberInputField,
  Switch,
} from "@chakra-ui/react";
import { ArrowRight } from "react-feather";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const EXCHANGE_RATE = 0.83;

const usdState = atom({
  key: "usd",
  default: 1,
});

const eurState = selector({
  key: "eur",
  get: ({ get }) => {
    let usd = get(usdState);
    const commisionEnabled = get(commissionEnabledState);

    if (commisionEnabled) {
      const commision = get(commissionState);
      usd = removeCommission(usd, commision);
    }
    return usd * EXCHANGE_RATE;
  },
  set: ({ get, set }, newEurValue) => {
    // @ts-ignore
    let newUsdValue = newEurValue / EXCHANGE_RATE;
    const commisionEnabled = get(commissionEnabledState);

    if (commisionEnabled) {
      const commision = get(commissionState);
      newUsdValue = addCommission(newUsdValue, commision);
    }

    set(usdState, newUsdValue);
  },
});

const commissionEnabledState = atom({
  key: "commissionEnabled",
  default: false,
});

const commissionState = atom({
  key: "commission",
  default: 5,
});

export const Selectors = () => {
  const [usd, setUsd] = useRecoilState(usdState);
  const [eur, setEur] = useRecoilState(eurState);

  return (
    <div style={{ padding: 20 }}>
      <Heading size="lg" mb={2}>
        Currency converter
      </Heading>
      <InputStack>
        <CurrencyInput label="usd" amount={usd} onChange={(usd) => setUsd(usd)} />
        <CurrencyInput label="eur" amount={eur} onChange={(eur) => setEur(eur)} />
      </InputStack>
      <Commission />
    </div>
  );
};

// You can ignore everything below this line.
// It's just a bunch of UI components that we're using in this example.

const InputStack: React.FC = ({ children }) => {
  return (
    <HStack
      width="300px"
      mb={4}
      spacing={4}
      divider={
        <Box border="0 !important" height="40px" alignItems="center" display="flex">
          <Icon as={ArrowRight} />
        </Box>
      }
      align="flex-end"
    >
      {children}
    </HStack>
  );
};

const CurrencyInput = ({
  amount,
  onChange,
  label,
}: {
  label: string;
  amount: number;
  onChange?: (amount: number) => void;
}) => {
  let symbol = label === "usd" ? "$" : "€";

  return (
    <FormControl id={label.toUpperCase()}>
      <FormLabel>{label.toUpperCase()}</FormLabel>
      <NumberInput
        value={`${symbol} ${amount}`}
        onChange={(value) => {
          const withoutSymbol = value.split(" ")[0];
          onChange?.(parseFloat(withoutSymbol || "0"));
        }}
      >
        <NumberInputField />
      </NumberInput>
    </FormControl>
  );
};

const Commission = () => {
  const [enabled, setEnabled] = useRecoilState(commissionEnabledState);
  const [commission, setCommission] = useRecoilState(commissionState);

  return (
    <Box width="300px">
      <FormControl display="flex" alignItems="center" mb={2}>
        <FormLabel htmlFor="includeCommission" mb="0">
          Include forex commission?
        </FormLabel>
        <Switch
          id="includeCommission"
          isChecked={enabled}
          onChange={(event) => setEnabled(event.currentTarget.checked)}
        />
      </FormControl>
      <NumberInput
        isDisabled={!enabled}
        value={commission}
        onChange={(value) => setCommission(parseFloat(value || "0"))}
      >
        <NumberInputField />
      </NumberInput>
    </Box>
  );
};

const addCommission = (amount: number, commission: number) => {
  return amount / (1 - commission / 100);
};

const removeCommission = (amount: number, commission: number) => {
  return amount * (1 - commission / 100);
};
