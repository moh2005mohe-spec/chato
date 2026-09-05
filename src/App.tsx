import { ClerkAppWrapper } from './components/ClerkAuthWrapper';
import { MainAppWrapper } from './components/MainAppWrapper';

export default function App() {
  return (
    <ClerkAppWrapper>
      <MainAppWrapper />
    </ClerkAppWrapper>
  );
}
