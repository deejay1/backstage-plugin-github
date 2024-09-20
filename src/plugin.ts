import {
  createPlugin,
  githubAuthApiRef,
  fetchApiRef,
  createApiFactory,
  createComponentExtension,
  configApiRef,
} from '@backstage/core-plugin-api';
import { githubApiRef, GithubClient } from './api';

export const backstageGithubPlugin = createPlugin({
  id: 'backstage-statusneo-plugin-github',
  apis: [
    createApiFactory({
      api: githubApiRef,
      deps: {
        authApi: githubAuthApiRef,
        fetchApi: fetchApiRef,
        configApi: configApiRef,
      },
      factory(deps) {
        return new GithubClient(deps);
      },
    }),
  ],
});

export const GithubPullRequestsCard = backstageGithubPlugin.provide(
  createComponentExtension({
    name: 'GithubUserPullRequestsCard',
    component: {
      lazy: () =>
        import('./components/UserPullRequestsCard').then(
          m => m.UserPullRequestsCard,
        ),
    },
  }),
);

export const GithubActionsCard = backstageGithubPlugin.provide(
  createComponentExtension({
    name: 'GithubActionsCard',
    component: {
      lazy: () =>
        import('./components/GithubActionsCard').then(m => m.GithubActionsCard),
    },
  }),
);
