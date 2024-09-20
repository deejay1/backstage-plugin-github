import React from 'react';

import {
  ApiBlueprint,
  createApiFactory,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { compatWrapper } from '@backstage/core-compat-api';
import {
  configApiRef,
  fetchApiRef,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { githubApiRef, GithubClient } from './api';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
} from '@backstage/plugin-catalog-react/alpha';

const githubApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: githubApiRef,
      deps: {
        authApi: githubAuthApiRef,
        fetchApi: fetchApiRef,
        configApi: configApiRef,
      },
      factory: deps => new GithubClient(deps),
    }),
  },
});

const GithubPullRequestEntityCard = EntityCardBlueprint.make({
  params: {
    loader: () =>
      import('./components/UserPullRequestsCard').then(m =>
        compatWrapper(<m.UserPullRequestsCard />),
      ),
  },
});
const GithubActionsEntityCard = EntityContentBlueprint.make({
  name: 'githubactions',
  params: {
    defaultPath: '/ci-cd',
    defaultTitle: 'CI/CD',
    loader: () =>
      import('./components/GithubActionsCard').then(m =>
        compatWrapper(<m.GithubActionsCard />),
      ),
  },
});

export default createFrontendPlugin({
  id: 'backstage-statusneo-plugin-github',
  extensions: [githubApi, GithubPullRequestEntityCard, GithubActionsEntityCard],
});
