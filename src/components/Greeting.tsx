import type { FC } from 'react';

type GreetingProps = {
  name?: string;
};

export const Greeting: FC<GreetingProps> = ({ name = 'friend' }) => {
  const safeName = name.trim() || 'friend';

  return (
    <section aria-live="polite">
      <p data-testid="greeting-message">Hello, {safeName}! 🎉</p>
      <small>Welcome to the TVBN operational toolkit.</small>
    </section>
  );
};
