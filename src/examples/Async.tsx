import { Container, Heading, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Suspense, useState } from "react";
import { atomFamily, selectorFamily, useRecoilValue, useSetRecoilState } from "recoil";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "@chakra-ui/react";
import { getWeather } from "./FakeAPI";

const userState = selectorFamily<any, number>({
  key: "user",
  get: (userId: number) => async () => {
    const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(
      (res) => res.json()
    );

    return userData;
  },
});

const wetherState = selectorFamily({
  key: "weather",
  get:
    (userId: number) =>
    async ({ get }) => {
      get(weatherRequestIdState(userId));

      const user = get(userState(userId));
      const weather = await getWeather(user.address.city);

      return weather;
    },
});

const weatherRequestIdState = atomFamily({
  key: "weatherRequestId",
  default: 0,
});

const useRefetchWeather = (userId: number) => {
  const setRequestId = useSetRecoilState(weatherRequestIdState(userId));

  return () => {
    setRequestId((id) => id + 1);
  };
};

const UserWeather = ({ userId }: { userId: number }) => {
  const user = useRecoilValue(userState(userId));
  const weather = useRecoilValue(wetherState(userId));
  const refresh = useRefetchWeather(userId);

  return (
    <>
      <Text>
        <b>Weather for {user.address.city}:</b> {weather}°C
      </Text>
      <Button onClick={refresh}>(refresh weather)</Button>
    </>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div>
      <Heading as="h2" size="md" mb={1}>
        Something went wrong
      </Heading>
      <Text>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Ok</Button>
    </div>
  );
};

const UserData = ({ userId }: { userId: number }) => {
  const user = useRecoilValue(userState(userId));
  if (!user) return null;

  return (
    <div>
      <Heading as="h2" size="md" mb={1}>
        User data:
      </Heading>
      <Text>
        <b>Name:</b> {user.name}
      </Text>
      <Text>
        <b>Phone:</b> {user.phone}
      </Text>
      <Suspense fallback={<div>Loading weather...</div>}>
        <UserWeather userId={userId} />
      </Suspense>
    </div>
  );
};

export const Async = () => {
  const [userId, setUserId] = useState<number | undefined>(undefined);

  return (
    <Container py={10}>
      <Heading as="h1" mb={4}>
        View Profile
      </Heading>
      <Heading as="h2" size="md" mb={1}>
        Choose a user:
      </Heading>
      <Select
        placeholder="Choose a user"
        mb={4}
        value={userId}
        onChange={(event) => {
          const value = event.target.value;
          setUserId(value ? parseInt(value) : undefined);
        }}
      >
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
        <option value="4">User 4</option>
      </Select>
      {userId !== undefined && (
        // @ts-ignore
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => setUserId(undefined)}>
          <Suspense fallback={<div>Loading user data...</div>}>
            <UserData userId={userId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Container>
  );
};
