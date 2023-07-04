import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component {
  constructor(props: Props) {
    super(props);
  }

  state = { hasError: false };
  props: Props = { children: null, fallback: null };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: unknown }) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
