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
      path: 'templates',
      ...resolveAsyncRoute(() => import('./TemplatesRoute'))
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
          path: 'summary',
          ...resolveAsyncRoute(() =>
            import('./components/Submissions/SubmissionSummary')
          )
        },
        {
          path: 'individual',
          ...resolveAsyncRoute(() =>
            import('./components/Submissions/SubmissionIndividual')
          )
        }
      ]
    },
    {
      path: ':surveyId/results',
      ...resolveAsyncRoute(() => import('./SubmissionsPublicResultsRoute'))
    }
  ]
};
