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
    }
  ]
};
