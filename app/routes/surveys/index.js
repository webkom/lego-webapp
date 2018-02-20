import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'surveys',
  indexRoute: resolveAsyncRoute(() => import('./SurveyRoute')),
  childRoutes: [
    {
      path: 'add',
      ...resolveAsyncRoute(() => import('./AddSurveyRoute'))
    },
    {
      path: ':surveyId',
      ...resolveAsyncRoute(() => import('./SurveyDetailRoute'))
    },
    {
      path: ':surveyId/edit',
      ...resolveAsyncRoute(() => import('./EditSurveyRoute'))
    },
    {
      path: ':surveyId/answer',
      ...resolveAsyncRoute(() => import('./AddSubmissionRoute'))
    },
    {
      path: ':surveyId/submissions',
      ...resolveAsyncRoute(() => import('./SubmissionsRoute')),
      childRoutes: [
        {
          path: 'summary', // admin/groups/123/settings
          ...resolveAsyncRoute(() =>
            import('./components/Submissions/SubmissionSummary')
          )
        },
        {
          path: 'individual', // admin/groups/123/members
          ...resolveAsyncRoute(() =>
            import('./components/Submissions/SubmissionIndividual')
          )
        }
      ]
    }
  ]
};
