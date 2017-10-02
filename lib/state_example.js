module.exports = {
  location: {
    pathname: '/events',
    search: '',
    hash: '',
    action: 'PUSH',
    key: 'j6fmro',
    query: {}
  },
  params: {},
  route: {},
  router: {
    location: {
      pathname: '/events',
      search: '',
      hash: '',
      action: 'PUSH',
      key: 'j6fmro',
      query: {}
    },
    params: {},
    routes: [
      {
        path: '/',
        indexRoute: {},
        childRoutes: [
          {
            path: 'events',
            indexRoute: {},
            childRoutes: [
              {
                path: 'calendar',
                childRoutes: [
                  {
                    path: ':year',
                    childRoutes: [
                      {
                        path: ':month'
                      }
                    ]
                  }
                ]
              },
              {
                path: ':eventId'
              },
              {
                path: ':eventId/administrate'
              }
            ]
          },
          {
            path: 'users',
            childRoutes: [
              {
                path: 'me'
              },
              {
                path: 'me/settings'
              },
              {
                path: ':username'
              }
            ]
          },
          {
            path: 'articles',
            indexRoute: {},
            childRoutes: [
              {
                path: 'new'
              },
              {
                path: ':articleId'
              },
              {
                path: ':articleId/edit'
              }
            ]
          },
          {
            path: 'meetings',
            indexRoute: {},
            childRoutes: [
              {
                path: 'create'
              },
              {
                path: 'answer/result'
              },
              {
                path: 'answer/:action'
              },
              {
                path: ':meetingId'
              },
              {
                path: ':meetingId/edit'
              }
            ]
          },
          {
            path: 'admin',
            indexRoute: {},
            childRoutes: [
              {
                path: 'groups',
                childRoutes: [
                  {
                    path: ':groupId',
                    childRoutes: [
                      {
                        path: 'settings'
                      },
                      {
                        path: 'members'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: 'quotes',
            indexRoute: {},
            childRoutes: [
              {
                path: 'add'
              },
              {
                path: ':quoteId'
              }
            ]
          },
          {
            path: 'pages',
            childRoutes: [
              {
                path: ':pageSlug'
              }
            ]
          },
          {
            path: 'companies',
            indexRoute: {},
            childRoutes: [
              {
                path: ':companyId'
              }
            ]
          },
          {
            path: 'search',
            indexRoute: {}
          },
          {
            path: 'interestgroups',
            indexRoute: {},
            childRoutes: [
              {
                path: 'create'
              },
              {
                path: ':interestGroupId'
              }
            ]
          },
          {
            path: 'joblistings',
            indexRoute: {},
            childRoutes: [
              {
                path: ':joblistingId'
              }
            ]
          },
          {
            path: 'bdb',
            indexRoute: {},
            childRoutes: [
              {
                path: 'add'
              },
              {
                path: ':companyId'
              },
              {
                path: ':companyId/edit'
              },
              {
                path: ':companyId/semesters/add'
              },
              {
                path: ':companyId/semesters/:semesterId'
              },
              {
                path: ':companyId/company-contacts/add'
              },
              {
                path: ':companyId/company-contacts/:companyContactId'
              }
            ]
          },
          {
            path: '*'
          }
        ]
      },
      {
        path: 'events',
        indexRoute: {},
        childRoutes: [
          {
            path: 'calendar',
            childRoutes: [
              {
                path: ':year',
                childRoutes: [
                  {
                    path: ':month'
                  }
                ]
              }
            ]
          },
          {
            path: ':eventId'
          },
          {
            path: ':eventId/administrate'
          }
        ]
      },
      {}
    ]
  },
  routeParams: {},
  routes: [
    {
      path: '/',
      indexRoute: {},
      childRoutes: [
        {
          path: 'events',
          indexRoute: {},
          childRoutes: [
            {
              path: 'calendar',
              childRoutes: [
                {
                  path: ':year',
                  childRoutes: [
                    {
                      path: ':month'
                    }
                  ]
                }
              ]
            },
            {
              path: ':eventId'
            },
            {
              path: ':eventId/administrate'
            }
          ]
        },
        {
          path: 'users',
          childRoutes: [
            {
              path: 'me'
            },
            {
              path: 'me/settings'
            },
            {
              path: ':username'
            }
          ]
        },
        {
          path: 'articles',
          indexRoute: {},
          childRoutes: [
            {
              path: 'new'
            },
            {
              path: ':articleId'
            },
            {
              path: ':articleId/edit'
            }
          ]
        },
        {
          path: 'meetings',
          indexRoute: {},
          childRoutes: [
            {
              path: 'create'
            },
            {
              path: 'answer/result'
            },
            {
              path: 'answer/:action'
            },
            {
              path: ':meetingId'
            },
            {
              path: ':meetingId/edit'
            }
          ]
        },
        {
          path: 'admin',
          indexRoute: {},
          childRoutes: [
            {
              path: 'groups',
              childRoutes: [
                {
                  path: ':groupId',
                  childRoutes: [
                    {
                      path: 'settings'
                    },
                    {
                      path: 'members'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: 'quotes',
          indexRoute: {},
          childRoutes: [
            {
              path: 'add'
            },
            {
              path: ':quoteId'
            }
          ]
        },
        {
          path: 'pages',
          childRoutes: [
            {
              path: ':pageSlug'
            }
          ]
        },
        {
          path: 'companies',
          indexRoute: {},
          childRoutes: [
            {
              path: ':companyId'
            }
          ]
        },
        {
          path: 'search',
          indexRoute: {}
        },
        {
          path: 'interestgroups',
          indexRoute: {},
          childRoutes: [
            {
              path: 'create'
            },
            {
              path: ':interestGroupId'
            }
          ]
        },
        {
          path: 'joblistings',
          indexRoute: {},
          childRoutes: [
            {
              path: ':joblistingId'
            }
          ]
        },
        {
          path: 'bdb',
          indexRoute: {},
          childRoutes: [
            {
              path: 'add'
            },
            {
              path: ':companyId'
            },
            {
              path: ':companyId/edit'
            },
            {
              path: ':companyId/semesters/add'
            },
            {
              path: ':companyId/semesters/:semesterId'
            },
            {
              path: ':companyId/company-contacts/add'
            },
            {
              path: ':companyId/company-contacts/:companyContactId'
            }
          ]
        },
        {
          path: '*'
        }
      ]
    },
    {
      path: 'events',
      indexRoute: {},
      childRoutes: [
        {
          path: 'calendar',
          childRoutes: [
            {
              path: ':year',
              childRoutes: [
                {
                  path: ':month'
                }
              ]
            }
          ]
        },
        {
          path: ':eventId'
        },
        {
          path: ':eventId/administrate'
        }
      ]
    },
    {}
  ],
  children: null,
  currentUser: {
    id: 1,
    username: 'webkom',
    firstName: 'webkom',
    lastName: 'webkom',
    fullName: 'webkom webkom',
    email: 'webkom@abakus.no',
    profilePicture:
      'https://thumbor.abakus.no/xPuRHJeEKUX9mGf0j4mn35Svcl0=/200x200/abakus_webkom_6J9lYCU.png',
    gender: 'male',
    allergies: '',
    isStaff: false,
    isActive: true,
    abakusGroups: [
      {
        id: 1,
        name: 'Users'
      },
      {
        id: 2,
        name: 'Abakus'
      },
      {
        id: 11,
        name: 'Webkom'
      }
    ],
    isAbakusMember: true,
    isAbakomMember: true,
    penalties: [],
    icalToken:
      'Siq8hKfVOkDQxlQAx24FYq94PLAl7NjkfafIEudwrEPvgcacPb8Qru19izMuwOpb'
  },
  loggedIn: true,
  events: [
    {
      id: 29,
      title: 'Casino Royale',
      description:
        'Det er igjen duket for Casino Royale. Det betyr finstasen på, poker, rulett, klassiske blackjack og nytt i år... eget nybegynnerbord. Alt finner sted på Håndverkeren.',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Arrangementet blir i år tilpasset alle, uavhengig om pokerferdighetene er på plass eller ei. Det vil si at vi arrangerer et nybegynnerbord, så du har nå gode muligheter til å lære deg poker en gang for alle. Dessuten er dette en ypperlig anledning å samles en siste gang før eksamensperioden starter for fullt. \r\n\r\nEn hyggelig lounge vil settes opp med muligheter for hyggelige samtaler eller pust i bakken mellom slagene. Du trenger med andre ord ikke spille hele kvelden, da du kan komme og gå som du vil til spillbordene.\r\n \r\nEllers vil Håndverkeren bli dekorert for anledningen, og velkomstdrink vil bli servert ved ankomst. Etter arrangementet går turen til byen for de som måtte ønske det. \r\n\r\nTil info:\r\n \r\n- Antrekk: Dress/smoking/kjole\r\n\r\n- Premieutdelinger vil avholdes med blandt annet:\r\n- - Beste pokerspiller(flest chips)\r\n- - Beste Antrekk (King and Queen)\r\n\r\n\r\n- Medbrakt drikke er tillat. ',
      eventType: 'event',
      location: 'Håndverkeren',
      startTime: '2017-05-12T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-12T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 18,
      tags: []
    },
    {
      id: 30,
      title: 'Infomøte for faddere',
      description:
        'Et nytt semester går mot slutten og fadderperioden 2016 nærmer seg med stormskritt.\r\n',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Om bare noen måneder strømmer tusenvis av nye studenter til Trondheim. Mange kommer rett fra videregående, de fleste har ikke bodd for seg selv før og antageligvis alle er fylt med et hav av forventninger. Som fersk student kan Studentbyen og -tilværelsen virke både overveldende og skremmende.\r\n\r\nI løpet av fadderperioden håper vi å gi de nye studentene ved Data- og Kommunikasjonsteknologi en mer behagelig start på studiet. I løpet av to (intense) uker skal fadderbarna vises rundt på skolen og i byen,  møte og bli kjent med medstudenter, og ikke minst ha det veldig, veldig gøy.\r\n\r\nFor å gjøre dette mulig trenger vi hjelp fra alle abakuler, særlig de som til høsten begynner i 2. klasse. De fleste husker sikkert hvor godt og betryggende det var å ha noen erfarne studenter man kunne lene seg på, og bli guidet av gjennom to uker med fart, spenning og nye impulser.\r\n\r\nHar du lyst til å være en del av fadderperioden 2016? \r\n18. april, klokken 10:30 arrangerer Arrkom infomøte for den kommende fadderperioden i S2.\r\n',
      eventType: 'other',
      location: 'S2',
      startTime: '2017-05-13T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-13T20:15:00.000Z',
      totalCapacity: 15,
      company: null,
      registrationCount: 8,
      tags: []
    },
    {
      id: 31,
      title: 'Fiesta!',
      description:
        'Få mennesker kan feste hardere, lengre og mer høylytt enn meksikanere, men blant de få er definitivt Labamba og abakulene! ',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Fredag 15. april er det duket for en fiesta av så godt kaliber at meksikanere har åpnet tårekanalene på vidt gap i ren sjalusi. Vi har tømt samtlige Sør-Amerikanske land for tequila for nå drikkes det til det er tosifret promille og alle snakker flytende spansk! Bart, sombrero og god stemning er obligatorisk - poncho er rått og klær er valgfritt.\r\n\r\nFiestaen blir så rå og høylytt at den er hos døveforeningen sine lokaler i Klostergata 60. Dette er jo et fantastisk kvalitetsstempel for alle vet at de er Trondheims fremste eksperter på god musikk!\r\n\r\nEttersom vi har nok tequila til å fylle Chihuahua, Durango og Jalisco tredve ganger selger vi i kjent meksikansk stil tequila til skampris: \r\n19-20: 10 kroner, \r\n20-21: 15 kroner, \r\n21-22: 20 kroner, \r\n22-01: 25 kroner\r\n\r\nViva la fiesta!',
      eventType: 'party',
      location: ' Klostergata 60 ',
      startTime: '2017-05-14T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-14T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 32,
      title: 'BEKK',
      description:
        'Nå har vi lyst å dele en av fagdagene med resten av bransjen, og vi har et begrenset antall gratis plasser for studenter. Søknadsfrist 15. Mars!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'I BEKK er vi opptatt av faglig utvikling og kunnskapsdeling. Hvert år arrangerer vi tre fagdager der alle våre ansatte deltar. Vi står selv som foredragsholdere og workshop-fasilitatorer – vi har stor tro på å lære av og med hverandre.\r\n\r\nFagdagen er gratis for et begrenset antall studenter. Vil du være med? Bare fortell oss hva du studerer og hvorfor du vil delta!\r\n\r\nSend inn din søknad på [fagdag.bekk.no](http://fagdag.bekk.no ) \r\n\r\nSøknadsfrist: 15. Mars\r\n',
      eventType: 'other',
      location: 'Radisson Blu Scandinavia, Holbergs plass, Oslo',
      startTime: '2017-05-15T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-15T20:15:00.000Z',
      totalCapacity: 15,
      company: {
        id: 1,
        name: 'BEKK',
        website: 'http://bekk.no'
      },
      registrationCount: 8,
      tags: []
    },
    {
      id: 33,
      title: 'IT-Sikkerhet med Knowit',
      description:
        'Har du lyst til å sette opp en egen server i skyen med basic sikkerhetsoppsett? Knowit kommer for å snakker om kjente sikkerhetstiltak og guider deg gjennom oppsettet',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'De beste kursene gir deg noe kult som du kan ha etter kurset, derfor vil du etter vårt sikkerhetskurs sitte igjen med en sikret webserver som du kan bruke til personlige websider, CV, prosjekter, APIer eller hva enn du måtte ønske.\r\n\r\nVi skal fortelle en kort sikkerhetshistorie, prate om Server Hosting, SSH, HTTPS, OWASP, Tor, og mer. Kurset avsluttes med en konkurranse.\r\n\r\n_Forberedelse:_\r\n- Registrer deg for GitHubs Student Pack her: https://education.github.com/pack\r\n\r\n_Utstyrkrav:_\r\n- Ta med egen datamaskin, samt strømkabel.\r\n\r\n_Forkunnskapskrav:_ \r\n- Ingen.\r\n\r\n\r\nAgenda:\r\n\r\n- Kort om Knowit\r\n\r\n- Lyntaler: Samfundets datalekkasje / Server hosting /      SSH/HTTPS / OWASP / Tor\r\n\r\n- Serveroppsett del 1\r\n\r\n- Pause med underholdning og mat\r\n\r\n- Serveroppsett del 2\r\n\r\n- Konkurranse med premier\r\n\r\n- Øl og mingling v/ Work-Work\r\n\r\n\r\n\r\n\r\n\r\n\r\n',
      eventType: 'course',
      location: 'H3',
      startTime: '2017-05-16T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-16T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 15,
      tags: []
    },
    {
      id: 34,
      title: 'KiD',
      description:
        'Vil du lære mer om kunstig intelligens?\r\n=======================================\r\n\r\n**Næringslivsnettverket KiD med Accenture, Telenor og NTNU vil gi en innføring i kunstig intelligens gjennom korte inspirasjonsforedrag og kreativ idémyldring. Det vil også være premietrekning av en Lego Mindstorm og en Chromecast!**\r\n \r\n\r\n\r\n',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        '**Program for kvelden**\r\n\r\n17:00 Dørene åpner\r\n\r\n17:15 - 17:20 Velkommen ved Torbjørn Eik-Nes\r\n\r\n17:20 – 18:20 Inspirasjonsforedrag ved IDI, Accenture, Telenor Research og Simula.\r\n\r\n18:20 - 18:30 Presentasjon av gruppeoppgaver/inndeling av grupper\r\n\r\n18:30 – 19:30 Idémyldring og oppgaveløsning i grupper og bespisning\r\n\r\n19:30 – 20:15 Presentasjoner og premietrekning\r\n\r\n\r\n**En smakebit på foredragene:**\r\n \r\n_«Kunstig Intelligens:  Teknologi, Tull, Trolldom, Trussel?»_\r\n\r\nFagfeltet har kjørt en berg-og-dale bane av forventninger, suksess, svikt, skepsis og frykt gjennom sine 60 år.  Hvorfor ble det slik, og hvorfor er det så mye mediaoppmerksomhet rundt KI nå?» \r\nKeith/IDI\r\n \r\n*«Ledelse i maskinalderen: Hvordan kunstig intelligens kommer til å endre lederens jobb»*\r\n\r\n«Ledere bruker mesteparten av tiden sin på oppgaver intelligente maskiner snart kan gjøre for dem. Vil man få maskiner i ledergruppen? Vegard vil presentere nordiske og internasjonale resultater fra en undersøkelse blant 1770 ledere globalt og vil snakke om hvordan fremtidens ledere vil jobbe med intelligente maskiner og trenge helt nye ferdigheter for å lykkes.» \r\nTorbjørn/Vegard (Accenture)\r\n\r\n*«Bildegjenkjenning»*\r\n\r\nNevrale nettverk står nå for "state of the art" innen bildegjenkjenning, noe som også er kjent som deep learning. Presentasjonen vil vise kort potensialet, hva vi gjør i Telenor Research, og oppfordre til tanker om hva denne metodologien kan brukes til..» \r\nAxel Tidemann/Telenor Research\r\n \r\n\r\n\r\n\r\n\r\n',
      eventType: 'company_presentation',
      location: 'KJL1',
      startTime: '2017-05-17T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-17T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 0,
      tags: []
    },
    {
      id: 35,
      title: 'Vaargalla',
      description: 'Lørdag 9. april inviterer Abakus til Vaargalla!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        "Hva er vel bedre for å feire at våren er her, enn en egen galla for det? Vaargallaen blir ærverdig, minnerik og en anledning til å ta på seg finstasen for å vise seg fra sin beste side! Arrangementet er for alle, så bli med og ta del i Abakus' gamle tradisjoner, og vær med på å skape nye!\r\n\r\nDet vil først bli vorspiel på Håndverkeren klokken 16:30, før vi går videre til Banksalen klokken 18:30. Når festlighetene i Banksalen er over rundt klokken 24:00 beveger vi oss tilbake til Håndverkeren for en storslagen efterfest.\r\n\r\nVi benytter også anledningen til å hedre de nye medlemmene i Den Gyldne Kulerammes Orden. Abakus sin studenterorden Ordo Abaci Aurei (lat. Den Gyldne Kulerammes Orden) er stiftet for å hedre og belønne særlig utmerkede fortjenester for linjeforeningen Abakus og dens medlemmer. I likhet med andre studenterordenener, som for eksempel Studentersamfundets «Det Sorte Faars Ridderskap», har også Den Gyldne Kulerammes Orden sine egne sære tradisjoner med pomp og prakt, ironi og tull, dysterhet og dårskap, og håp og savn. Opp til flere av disse vil deltakerene skue i løpet av kvelden.\r\n\r\nPraktisk Info\r\n==================\r\n\r\nVorspiel: Håndverkeren (LaBamba står i baren med Abacash)\r\n\r\nSted for Vaargallaen: Banksalen\r\n\r\nEfterfest: Håndverkeren (LaBamba står i baren med Abacash til 03:00)\r\n\r\nAntrekk: Studentergalla med Abakus-utmerkelser\r\n\r\nDato: Lørdag 9. april 2016\r\n\r\nKlokkeslett: 16:30 på Håndverkeren, 18:30 på Banksalen.\r\n\r\nMat: 2-retters middag, en bong inkludert\r\n\r\nPris: 270",
      eventType: 'event',
      location: 'Banksalen',
      startTime: '2017-05-18T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-18T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 36,
      title: 'DnB',
      description:
        'Hvis du hadde IT-styrken til DNB, hvordan ville du brukt den? ',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'DNB har Norges mest besøkte nett- og mobilbank. Det er vi i IT stolte av.\r\n\r\nMed over 800 IT-kollegaer griper vi fatt i nye utfordringer og muligheter. Det er vi som leverer de digitale løsningene i DNB. Da er gode løsninger og sikkerhet viktig. \r\n\r\nDen 7. april vil vi dele refleksjoner og eksempler rundt hvor viktig IT er for DNB fremover, med ekstra fokus på IT-utvikling og informasjonssikkerhet. \r\n\r\nEtter presentasjonen tar vi buss ned til byen der det blir bespisning og mingling.\r\n\r\n_Bedkom minner om at oppmøte er kl. 17:00, ventelisten åpner 17:10 og presentasjonen starter 17:15._',
      eventType: 'company_presentation',
      location: 'KJL1',
      startTime: '2017-05-19T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-19T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 37,
      title:
        'Funksjonell programmering i Javascript med React og Redux  3 av 3',
      description:
        'Har du kodet en del javascript fra før, kanskje gjennom en sommerjobb eller på hobbybasis? Keen på lære mer om funksjonell programmering? Har du kanskje hørt om React eller Redux, men ikke helt kommet rundt til å lære deg det ennå? Vi viser deg state-of-the-art frontendteknologi med fokus på konsepter fra funksjonell programmering!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Vi starter med å se på hva funksjonell programmering faktisk er, og hvordan konsepter herfra brukes i stor grad i moderne frontendutvikling. Vi holder oss unna rammeverk i første omgang, og ser heller på grunnleggende programmering i javascript.\r\n\r\nPå dag to introduserer vi React - dagens ubestridte rammeverkkonge på weben. Vi begynner å lage en applikasjon, og knytter praksis sammen med konseptene fra funksjonell programmering.\r\n\r\nPå kursets siste dag skal vi snakke om Redux og hvordan vi bygger store, interaktive applikasjoner som er enkle å forstå og vedlikeholde.\r\n\r\nEtter kurset vil vi dra ned til sentrum hvor vi vil få god mat & drikke!\r\n\r\nVi gjør oppmerksom på at deltakere på del 2 vil få prioritet på del 3',
      eventType: 'course',
      location: 'EL2',
      startTime: '2017-05-20T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-20T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 38,
      title: 'Webutvikling101 3 av 3',
      description:
        'Er du nysgjerrig på webutvikling og lurer på hvordan du skal komme igang? Har du hørt snakk om HTML, CSS og JavaScript, men usikker på hva sammenhengen mellom dem er? Har du kanskje testa ut webutvikling, men ikke fått knappene til å havne der du vil ha dem? Da er du velkommen til Webutvikling101.',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Vi skal over 3 ettermiddager gå gjennom de mest grunnleggende delene av webutvikling:\r\n\r\nFørste runde skal vi lære om de underliggende prinsippene i webutvikling. Vi ser på hvordan CSS påvirker HTML og hvordan du kan bruke CSS til å forandre hvordan nettleseren presenterer siden både i layout og form. Vi ser også på hvordan du kan legge til enkel dynamikk og interaksjon med JavaScript.\r\n\r\nPå dag to tar vi et steg videre og ser på hvordan vi kan bruke JavaScript for å kommunisere med en server for å både sende og motta data. Vi skal også se på hvordan navigasjon mellom nettsider fungerer og hvordan vi kan benytte JavaScript til å endre hva som skjer når vi navigerer.\r\n\r\nDag tre vil være en litt friere dag. Vi kommer til å presentere en rekke utfordringer som tar for seg et aspekt ved webutvikling som dere kan få bryne dere på. Målet med denne dagen er å utforske mulighetene webben gir. Vi stiller med spisskompetanse og dere stiller med nysgjerrighet og ståpå-vilje.\r\n\r\nHa med egen PC, valgfri editor og nyeste node.js v4 eller nyere ([https://nodejs.org](https://nodejs.org)).\r\n\r\nEtter kurset vil vi dra ned til sentrum hvor vi vil få god mat & drikke!\r\n\r\nVi gjør oppmerksom på at deltakere på del 1 & 2 vil få prioritet på del 3\r\n\r\nInstruks for hvordan installere node:\r\n\r\n1. Gå til https://nodejs.org/en/\r\n\r\n2. Last ned nyeste stable (5.7.1)\r\n\r\n3. Kjør filen\r\n\r\n4. Følg installasjons-anvisningene\r\n\r\n5. Åpne terminalen\r\n**For OS X**: finnes under Applications/Utilities/Terminal. **For Windows**: klikk windows + r for å få opp run dialogen. skriv “cmd” og trykk enter.\r\n\r\n6. Skriv node  --version i terminalen trykk enter. Hvis alt er i orden skal den svare med versjonsnummer, v5.7.1',
      eventType: 'course',
      location: 'EL1',
      startTime: '2017-05-21T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-21T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 39,
      title: 'Lego Mindstorms med Itera',
      description:
        'Hvem tar flagget først? Du eller din studievenn? Itera kjører Capture the ”flag” med Java og Lego Mindstorms! [Promovideo](https://vimeo.com/160542061)',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Lego Lego Lego. Vi får ikke nok av Lego, forhåpentligvis gjelder det samme for deg. Vi tar med oss roboter til Trondheim nok en gang, men denne gangen for å konkurrere om å fange ”flagget” først. Hvert lag får ei sone som skal forsvare og en sone som skal angripes. Utfordringa blir å kode og bygge den beste forsvarsroboten og den beste angrepsroboten. Her gjelder det å finne frem sine beste triks for å holde seg i spill og samle mest mulig poeng!\r\n\r\nBanen er delt opp i 4 farger for å kunne navigere seg rundt på banen, samt kalkulere posisjon til de andre robotene. Alle roboter kommuniserer sin fargeposisjon til en server som vil kalkulere livestatus i spillet, samt sende ut fargeposisjon til alle roboter. På banen vil det være plassert to flaggsirkler, et for hvert lag. Når du er på motstanderens flaggsirkel vil du få poeng....men pass på så ikke motstanderen dytter deg av banen!\r\n\r\nFor å styre robotene bruker vi et custom OS, leJOS, slik at vi kan bruke Java i stedet for "pek og klikk"-språket som følger med originalt. Du kan lese mer om leJOS på http://www.lejos.org/. Alle vil få tildelt et rammeverk som vil ta seg av lesing av posisjon, kommunikasjon med server, samt gi tilgang på metoder for å navigere roboten.\r\n\r\nGit-repo finnes her: https://github.com/Itera/HelloBrick\r\n\r\nVi tar med ferdigkonfigurerte maskiner slik at vi kan bruk mest mulig tid på koding og seriøs konstruksjon av kampmaskiner. Hvert lag får tildelt 2 roboter som skal bygges og kodes til en forsvarsmaskin og en angrepsmaskin. Hvert lag består av 8 studenter (4 til angrepsrobot og 4 til forsvarsrobot).\r\n\r\nDet blir servert pizza og sushi under kurset. På slutten av kvelden kjører vi kamp. Måtte det beste laget vinne :) Når vi er ferdig tar vi turen til Work-Work for mingling og shuffleboard.\r\n\r\nDet vil bli lagt ut detaljerte regler sammen med kodebase noen dager før kurset slik at alle stiller likt på kampadagen! Skulle du være 1.klassing og føler du har nok javakunnskaper til å delta er det bare å sende mail til arrangør hvis det er ledige plasser.',
      eventType: 'course',
      location: 'IT-Vest 454',
      startTime: '2017-05-22T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-22T20:15:00.000Z',
      totalCapacity: 15,
      company: null,
      registrationCount: 9,
      tags: ['Øl', 'GameDev', 'Java']
    },
    {
      id: 40,
      title: 'Teknologivennefest',
      description:
        'Lei av å avstandsbeundre den søte jenta fra maskin? Eller han kjekke hunken på Emil? Keen på å bli bedre kjent med den kule gjengen på bakerste rad i forelesning? Dette er sjansen til å ta grep og bli bedre kjent på tvers av linjene!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        "Tiden har kommet for at Mannhullet, Emil, Abakus, Smørekoppen og Janus forenes! Teknologivennefesten arrangeres 31. mars og er en fest for alle teknologiretningene. \r\n\r\nEtter vors med hver respektive linje (teknologiretning for indøkere) samles alle på D12 for en uforglemmelig kveld! \r\nVi har liveband som går på kl. 23 og DJ utover kvelden. Dette vil dere ikke gå glipp av!\r\n\r\nVi kjører felles vors på Håndverker'n.\r\nFor info gå inn på:\r\n[https://www.facebook.com/events/257452054586185/](https://www.facebook.com/events/257452054586185/).\r\n\r\n\r\nAntrekk:\r\nRødt!",
      eventType: 'event',
      location: 'D12',
      startTime: '2017-05-23T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-23T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: ['Damer', 'Øl', 'Brus']
    },
    {
      id: 41,
      title: 'En reise hvor IT-infrastruktur blir kode',
      description:
        'Et praktisk kurs hvor vi lærer hvordan man setter opp IT-infrastruktur i skyløsningen Microsoft Azure. Vi skal se på tre ulike metoder for å opprette virtuelle maskiner (VM), og konfigurere VM-en til en webserver. Første metode er manuelt, deretter automatisert og tilslutt med «Infrastructure as Code». Kurset passer perfekt for deg som ønsker å lære om IT-infrastruktur og Microsoft-teknologier.',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Kurset vil være inndelt i tre deler. Hver del starter med 5-10 minutter teori, etterfulgt av ca. 20 minutter der man får prøve selv.\r\n\r\n- Del 1: Manuelt oppsett av webserver\r\n- Del 2: Automatisert oppsett av webserver   \r\n- Del 3: Fremtidens oppsett av webserver\r\n\r\nDet blir servert pizza og sushi når kurset starter. Etter kurset tar vi turen til Brygghus 9 for mingling. \r\n\r\nTa med deg PC. I forkant av kurset må du gjennomføre noen enkle forberedelser, guide finner du [her](http://azurekurs.mastech.no). Gjør kun det som står under "Forberedelser". ',
      eventType: 'course',
      location: 'H3',
      startTime: '2017-05-24T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-24T20:15:00.000Z',
      totalCapacity: 15,
      company: null,
      registrationCount: 9,
      tags: ['Web', 'Microsoft', 'Azure']
    },
    {
      id: 42,
      title: 'Kaffekurs hos Dromedar Kaffebar',
      description:
        'Dersom du er glad i kaffe og har lyst til å lære hvordan du kan lage bedre kaffe hjemme, da er denne kaffekvelden hos Dromedar noe for deg. Det blir et kurs med fokus på svart kaffe, hvor man kan få smake på forskjellige typer kaffe og lære nyttig tips og triks. ',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Vi starter med en liten søtchilismak og litt kaker, før vi får vite litt om kaffens lange vei fra busk til kopp. Deretter blir det en sammenlignende smaking av kaffe fra verdens mest spennende opprinnelser (cupping). Tilslutt teori og tips til hjemmekaffen av våre beste bryggemetoder (kalita, aeropress og softbrew), og dette er direkte oveførbart til å heve nivået på kaffen man lager i ettertid. \r\n\r\nDenne kvelden tar i underkant av tre timer, og kurset går i Dromedar sitt kursrom på dromedar moxness. Legg merke til at kurset starter 16.00 (ikke 16.15). ',
      eventType: 'course',
      location: 'Dromedar Moxness, Olav Tryggvassonsgate 14',
      startTime: '2017-05-25T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-25T20:15:00.000Z',
      totalCapacity: 15,
      company: null,
      registrationCount: 9,
      tags: []
    },
    {
      id: 43,
      title: 'StartIT',
      description:
        'StartIT er et faglig arrangement sponset av Abakus, som spesielt promoterer innovasjon innen IT. I år er det mange spennende foredrag man kan bli med på!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Merk at arrangementet er eksternt og at påmeldingen foregår på [StartIT sine sider](https://startntnu.hoopla.no/sales/startit/) **3. mars**\r\n------------------\r\n\r\n[Påmelding skjer ved å følge denne linken.](https://startntnu.hoopla.no/sales/startit/)\r\n\r\nStartIT er et arrangement som har hovedfokus på innovasjon i teknologiverdenen. Hit kommer flinke foredragsholdere med ulik bakgrunn for å formidle sin kunnskap. Her vil man lære om livet som gründer, teknologiske trender og moderne problemløsingsmetoder. Arrangementet skal fungere som en arena der gründere og studenter kan møte hverandre, danne team og starte sine egne eventyr.\r\n\r\nStartIT inviterer kjente og spennende foredragsholdere. Disse er med for å inspirere studentene til å ta det steget mange ikke tør ta. Tidligere foredragsholdere inkluderer Steve Wozniak, JottaCloud, Mathias Mikkelsen og mange fler.\r\n\r\nPå StartIT vil du møte mennesker som har en idé eller som har et ønske om å en dag bli gründer. Du trenger ikke ha en idé eller et ønske om å bli gründer for å delta, men forhåpentligvis vil kvelden tenne en liten flamme. Dette gir alle mulighet til å knytte viktige kontakter for fremtiden.',
      eventType: 'other',
      location: 'Radisson Blu Royal Garden',
      startTime: '2017-05-26T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-26T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 44,
      title: 'Funksjonell programmering i Javascript med React og Redux 2 av 3',
      description:
        'Har du kodet en del javascript fra før, kanskje gjennom en sommerjobb eller på hobbybasis? Keen på lære mer om funksjonell programmering? Har du kanskje hørt om React eller Redux, men ikke helt kommet rundt til å lære deg det ennå? Vi viser deg state-of-the-art frontendteknologi med fokus på konsepter fra funksjonell programmering!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Vi starter med å se på hva funksjonell programmering faktisk er, og hvordan konsepter herfra brukes i stor grad i moderne frontendutvikling. Vi holder oss unna rammeverk i første omgang, og ser heller på grunnleggende programmering i javascript.\r\n\r\nPå dag to introduserer vi React - dagens ubestridte rammeverkkonge på weben. Vi begynner å lage en applikasjon, og knytter praksis sammen med konseptene fra funksjonell programmering.\r\n\r\nPå kursets siste dag skal vi snakke om Redux og hvordan vi bygger store, interaktive applikasjoner som er enkle å forstå og vedlikeholde.\r\n\r\nUnder kurset vil vi ha en pause med bespisning og mingling, hvor vi etter pausen vil fortsette med kurset.\r\n\r\nVi gjør oppmerksom på at deltakere på del 1 vil få prioritet på del 2 & 3',
      eventType: 'course',
      location: 'EL2',
      startTime: '2017-05-27T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-27T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 45,
      title: 'Webutvikling101 2 av 3',
      description:
        'Er du nysgjerrig på webutvikling og lurer på hvordan du skal komme igang? Har du hørt snakk om HTML, CSS og JavaScript, men usikker på hva sammenhengen mellom dem er? Har du kanskje testa ut webutvikling, men ikke fått knappene til å havne der du vil ha dem? Da er du velkommen til Webutvikling101.\r\n\r\n',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Vi skal over 3 ettermiddager gå gjennom de mest grunnleggende delene av webutvikling:\r\n\r\nFørste runde skal vi lære om de underliggende prinsippene i webutvikling. Vi ser på hvordan CSS påvirker HTML og hvordan du kan bruke CSS til å forandre hvordan nettleseren presenterer siden både i layout og form. Vi ser også på hvordan du kan legge til enkel dynamikk og interaksjon med JavaScript.\r\n\r\nPå dag to tar vi et steg videre og ser på hvordan vi kan bruke JavaScript for å kommunisere med en server for å både sende og motta data. Vi skal også se på hvordan navigasjon mellom nettsider fungerer og hvordan vi kan benytte JavaScript til å endre hva som skjer når vi navigerer.\r\n\r\nDag tre vil være en litt friere dag. Vi kommer til å presentere en rekke utfordringer som tar for seg et aspekt ved webutvikling som dere kan få bryne dere på. Målet med denne dagen er å utforske mulighetene webben gir. Vi stiller med spisskompetanse og dere stiller med nysgjerrighet og ståpå-vilje.\r\n\r\nHa med egen PC, valgfri editor og nyeste node.js v4 eller nyere ([https://nodejs.org](https://nodejs.org)).\r\n\r\nUnder kurset vil vi ha en pause med bespisning og mingling, hvor vi etter pausen vil fortsette med kurset.\r\n\r\nVi gjør oppmerksom på at deltakere på del 1 vil få prioritet på del 2 & 3\r\n\r\nInstruks for hvordan installere node:\r\n\r\n1. Gå til https://nodejs.org/en/\r\n\r\n2. Last ned nyeste stable (5.7.1)\r\n\r\n3. Kjør filen\r\n\r\n4. Følg installasjons-anvisningene\r\n\r\n5. Åpne terminalen\r\n**For OS X**: finnes under Applications/Utilities/Terminal. **For Windows**: klikk windows + r for å få opp run dialogen. skriv “cmd” og trykk enter.\r\n\r\n6. Skriv node  --version i terminalen trykk enter. Hvis alt er i orden skal den svare med versjonsnummer, v5.7.1',
      eventType: 'course',
      location: 'EL1',
      startTime: '2017-05-28T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-28T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 46,
      title: 'Acando',
      description:
        'Acando er et konsulentselskap som bistår offentlige og private kunder i å lykkes. Vi er ofte engasjert i utfordrende og virksomhetskritiske leveranser og prosjekter hvor vår innsats kan bli et være eller ikke være for våre kunder.   \r\n',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Hos oss vil du jobbe med mange spennende kunder, prosjekter og problemstillinger. Våre kunder etterspør dyktige konsulenter som kan bistå dem med å realisere nye løsninger basert på dagens og morgendagens teknologi. Vi forbedrer og effektiviserer virksomheter, prosesser og tjenester ved hjelp av IKT. \r\n\r\nAcando Gruppen har ca. 1800 ansatte i fire land i Europa og leveransesentre i India og Latvia. Acando hadde en omsetning på nærmere to milliarder svenske kroner i 2014 og er notert på Nasdaq. Stockholm. Vi tilbyr et meget godt fagmiljø der alle er opptatt av å dele og hjelpe hverandre til å lykkes. Vi har et godt sosialt miljø og legger vekt på å skape balanse mellom jobb og fritid.\r\n\r\nBedriftspresentasjonen vil være i Acandos lokaler på Solsiden.\r\n\r\n_Bedkom vil minne om at oppmøte er foran hovedbygget kl. 17:00, ventelisten åpner 17:10 og bussen kjører 17:15._',
      eventType: 'company_presentation',
      location: 'Acandos lokaler i Trondheim',
      startTime: '2017-05-29T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-29T20:15:00.000Z',
      totalCapacity: 15,
      company: null,
      registrationCount: 9,
      tags: []
    },
    {
      id: 47,
      title: 'HTML5 Pixel-Magic ',
      description:
        'Har du lyst å leke deg med video i nettleser?  Vil du lære å lage din egen videospiller og koble den til webkameraet ditt? Kantega ønsker velkommen til kodeworkshop med solide doser HTML5-magi. Det bare fantasien din som setter grenser, så her lover vi utfordringer selv til de som har programmert i flere år.',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Med litt enkel Javascript-programmering kan du gjøre alt dette. Du kan også legge på egne effekter, kjenne igjen farger og objekter, gjøre bakgrunner gjennomsiktig og spille av musikkvideoer på en Post-It-lapp.\r\n\r\nSelve programmeringen er ikke spesielt vanskelig, så her trenger du ikke være ekspert for å ha det gøy mens du lager noe fancy du kan imponere vennene dine med. \r\n\r\nTa med deg laptop med webkamera og Chrome. Kantega stiller med resten av det du trenger!\r\n\r\n**Vi ønsker hjertelig velkommen til en lærerik og morsom kveld med god mat og drikke, og hyggelig sosialt samvær.**\r\n\r\n- Kantega inviterer til sine egne lokaler i Bassengbakken ved solsiden. Det vil bli satt opp buss fra hovedbygget på Gløshaugen. **Møt opp kl 17.00! Bussen drar 17.15 presis.**\r\n\r\n- Ved oppstart av kurset vil det bli servert ferske baguetter fra Franske nytelser.\r\n\r\n- Etter kurset vil det bli servert sushi fra Sabrura m. kyllingspyd og salat. Dette blir innledet med vinsmaking ledet av Kantegas egne vinkelnere. Det blir hyggelig mingling med servering av alkohol. \r\n\r\n_Mange av Kantegas ansatte startet med å jobbe deltid hos oss i studietiden. Nå vil vi bli kjent med flere. Kantega er en spennende og annerledes arbeidsplass. Vi lager IT-løsninger kundene vår ikke greier seg uten. Hos oss blir du utfordret faglig i et prisbelønnet arbeidsmiljø. Hos Kantega får alle mulighet til å bli likeverdige eiere i selskapet._ \r\n',
      eventType: 'course',
      location: 'Bassengbakken 4',
      startTime: '2017-05-30T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-30T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 48,
      title: 'Helgesamling',
      description:
        'Da er det klart for å samle Abakus sine komiteer for en Helgesamling uten like!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'I år arrangeres Helgesamlingen på Sundmans Fjellgård fra 5 - 6 mars. \r\n\r\nDet blir satt opp buss på dagen den 5. og hjem igjen dagen etter, 6. mars.\r\n\r\nPakkeliste:  \r\n- Alkohol! Det blir stopp på Coop på veien, så det går an å kjøpe drikke der (om man bestiller i forkant)  \r\n- Dynetrekk, putetrekk og laken  \r\n- Mat hvis du ønsker noe eget utenom felles (blir servert lunsj, middag, nattmat og frokost)  \r\n\r\nTemaet for workshopen er arrangementstilbudet i Abakus. Hvilke arrangementer bør vi satse på? Hvilke savner vi i tilbudet vårt? Er det noen som er overflødige? Treffer vi bredt nok? Her gjelder arrangementer for  Arrkom, Koskom, LaBamba, Bedkom og Fagkom.\r\n\r\nProgram:  \r\nTid\tAktivitet  \r\n10:30\tAvreise  \r\n14:30\tAnkomst og Lunsj  \r\n15:30\tTeambuilding  \r\n18:00\tPause  \r\n18:30\tWorkshop  \r\n21:00\tMiddag  \r\n01:00\tNattmat  \r\n09:00\tFrokost  \r\n10:00\tRydding  \r\n11:00\tUtsjekk  \r\n11:30   Avreise   \r\n\r\nDet vil bli festligheter og morsomheter i full Abakusstil så det er bare å glede seg!',
      eventType: 'event',
      location: 'Sundmans Fjällgård, Åre',
      startTime: '2017-05-31T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-05-31T20:15:00.000Z',
      totalCapacity: 15,
      company: null,
      registrationCount: 9,
      tags: []
    },
    {
      id: 49,
      title: 'Generalforsamling',
      description:
        "Velkommen til Abakus årlige generalforsamling! På Abakus' ordinære generalforsamling skal regnskap og årsberetning for 2015 legges frem. Forslag til statuttendringer vil legges frem og det skal velges totalt 6 stillinger.",
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        "Viktige dokumenter å gjøre seg kjent med i forkant:  \r\n---------------------------------------------------\r\n- [Referat fra åpen diskusjonskveld 8. februar](https://abakus.no/uploads/common/diskusjonskveld08022016.pdf)  \r\n- [Abakus' statutter](http://statutter.abakus.no/abakus-statutter.pdf)  \r\n- [Abakus' fonds statutter](http://statutter.abakus.no/fond-statutter.pdf)\r\n- [Sakspapirer og dagsorden](https://abakus.no/uploads/common/sakspapirer2016.pdf)  \r\n\r\nFor å gjøre Generalforsamlingen så effektiv som mulig ber Hovedstyret om at alle forbereder seg godt til de forskjellige sakene.\r\n\r\nAvstemninger vil som i 2015 gjennomføres ved bruk av [Abakus Vote](https://github.com/webkom/vote).\r\n\r\nKandidater til valg\r\n------------------\r\n**Fondstyret - Æresmedlem**  \r\n\r\n- Marte Berg Innset  \r\n\r\n**Fondstyret - Tidligere økonomiansvarlig i Hovedstyret**  \r\n\r\n- Kristoffer Finckenhagen  \r\n- Thinius Rosé  \r\n\r\n**Fondstyret - Abakus-medlem**  \r\n\r\n- Vemund Santi\r\n\r\n**Abakus-leder**  \r\n\r\n- Gaute Solbu Kleiven  \r\n- Vegard Hellem  \r\n- Henrietta Eide Bleness  \r\n- Stein-Otto Svorstøl  \r\n- Mats Lundell-Nygjelten  \r\n- Thomas Ulvøen\r\n\r\n**Nestleder i Hovedstyret**  \r\n\r\n- Tone Kathrine Ervik Winsnes  \r\n- Vegard Hellem  \r\n- Edvard Viggaklev Bakken  \r\n- Tiril Merethe Solberg  \r\n\r\n**Økonomiansvarlig i Hovedstyret**  \r\n\r\n- Hege Haavaldsen  \r\n\r\nGjennomføring av valg\r\n---------------------\r\n**Fondstyret**  \r\nKandidatene holder en lukket appell (dvs. andre kandidater får ikke høre på) på opptil 2 minutter. Så gjennomføres en åpen spørsmålsrunde på (3*antall kandidater) minutter der alle kandidatene hører hvert spørsmål og de andre kandidatenes svar. Rekkefølgen på hvem som svarer først går på rullering. Etter dette gjennomføres avstemning der man velges ved alminnelig flertall.\r\n\r\n**Abakus-leder**  \r\nKandidatene holder en lukket appell på opptil 3 minutter. Så gjennomføres en åpen spørsmålsrunde på (3*antall kandidater) minutter der alle kandidatene hører hvert spørsmål og de andre kandidatenes svar. Etter dette holdes en innledende avstemning der kandidaten med færrest antall stemmer fjernes inntil vi enten har en vinner ved alminnelig flertall, eller vi står igjen med tre kandidater. Om vi står igjen med tre kandidater uten at noen allerede har fått alminnelig flertall gjennomføres en åpen debatt i 20 minutter med 2 forhåndsbestemte temaer (se nedenfor) samt mulighet for flere spørsmål fra salen. Etter dette får hver kandidat presentere en 30 sekunders punchline (åpent, alle kandidatene hører hverandre) før vi går til siste avstemning der kandidaten med færrest antall stemmer fjernes inntil vi står igjen med en vinner ved alminnelig flertall.\r\n\r\nTemaer:  \r\n\r\n - Abakus' økonomi - hvordan blir ditt budsjett?  \r\n - Lederens rolle i Abakus  \r\n\r\n**Nestleder, og økonomiansvarlig i Hovedstyret**  \r\nSamme prosess som for Fondstyret, med 30 sekunders åpen punchline mellom spørsmålsrunde og avstemning.\r\n\r\nLes mer om stillingene til Hovedstyret [her](https://abakus.no/announcement/71/) og Fondsstyret [her](https://abakus.no/announcement/70/).\r\n\r\nDet vil bli servert kake, kaffe, brus og pizza. Mer info kommer. Spørsmål kan sendes til hs@abakus.no Vel møtt!",
      eventType: 'other',
      location: 'EL5',
      startTime: '2017-06-01T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-06-01T20:15:00.000Z',
      totalCapacity: 30,
      company: null,
      registrationCount: 19,
      tags: []
    },
    {
      id: 50,
      title: 'BEKK',
      description:
        'Vår kjære hovedsamarbeidspartner BEKK inviterer til bedriftspresentasjon. Meld deg på og bli bedre kjent med selskapet!',
      cover:
        'https://thumbor.abakus.no/EfrcZGvR-EQXq6aCMye27uQJaVk=/0x500/test_event_cover.png',
      text:
        'Bekk Consulting AS er et norsk konsulentselskap. Vi gjennomfører prosjekter for store private og offentlige virksomheter innen strategisk rådgivning, utvikling av IT-systemer og design av digitale tjenester. Vi er i dag over 380 fagpersoner.\r\n\r\nVi arbeider innen:\r\n\r\n**MANAGEMENT CONSULTING**\r\nVirksomheter som evner å skape gode opplevelser for sine kunder er fremtidens vinnere. Bekk Management Consulting hjelper deg til en kundesentrisk tilnærming for å sikre vedvarende konkurransekraft og lønnsomhet. Vår ambisjon er at våre kunder skal være best på sine kunder.\r\n\r\n**TECHNOLOGY CONSULTING**\r\nMed over 200 systemutviklere, it-arkitekter og prosjektledere er BEKK et av landets største systemutviklingsmiljøer. Stor faglig bredde og et tydelig kvalitetsfokus har gjort oss til foretrukket leverandør når Norges største virksomheter skal utvikle avanserte teknologiløsninger.\r\n\r\n**INTERACTIVE CONSULTING**\r\nBekk Interactive utvikler digitale tjenester for landets mest kjente merkevarer. Vi bryr oss om forretningsmål, konvertering, effekt og målbare resultater. For oss er estetikk og brukeropplevelse en selvfølge og ikke et mål i seg selv, enten vi utvikler for desktop, mobil, nettbrett, infoboards eller tv.\r\n\r\n_Vi vil minne om at registreringen åpner 17.00, ventelisten åpner 17.10 og at arrangementet begynner 17.15._  ',
      eventType: 'company_presentation',
      location: 'EL6',
      startTime: '2017-06-02T16:15:00.000Z',
      thumbnail:
        'https://thumbor.abakus.no/v6E9GdDSD_YBh-6iSOIWmFmwFW0=/500x500/smart/test_event_cover.png',
      endTime: '2017-06-02T20:15:00.000Z',
      totalCapacity: 30,
      company: {
        id: 1,
        name: 'BEKK',
        website: 'http://bekk.no'
      },
      registrationCount: 14,
      tags: ['JavaScript', 'Abakus', 'Java', 'Bedpres']
    }
  ],
  actionGrant: [
    'list',
    'create',
    'retrieve',
    'update',
    'partial_update',
    'destroy',
    'administrate',
    'payment'
  ],
  icalToken: 'Siq8hKfVOkDQxlQAx24FYq94PLAl7NjkfafIEudwrEPvgcacPb8Qru19izMuwOpb',
  pools: [
    {
      id: 45,
      name: 'Webkom',
      capacity: 15,
      activationDate: '2017-05-06T12:00:00Z',
      permissionGroups: [
        { id: 11, name: 'Webkom', description: '', parent: 3 }
      ],
      registrations: [
        {
          id: 421,
          user: {
            id: 19,
            username: 'loug',
            firstName: 'Hanne',
            lastName: 'Loug',
            fullName: 'Hanne Loug',
            gender: 'female',
            profilePicture:
              'https://thumbor.abakus.no/t7vb8MiIDeAx0QeQViWrWIAT_2A=/200x200/default_female_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 420,
          user: {
            id: 18,
            username: 'merethhe',
            firstName: 'Merethe',
            lastName: 'Heggset',
            fullName: 'Merethe Heggset',
            gender: 'female',
            profilePicture:
              'https://thumbor.abakus.no/t7vb8MiIDeAx0QeQViWrWIAT_2A=/200x200/default_female_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 419,
          user: {
            id: 17,
            username: 'larskirk',
            firstName: 'Lars Kirkholt',
            lastName: 'Melhus',
            fullName: 'Lars Kirkholt Melhus',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 418,
          user: {
            id: 16,
            username: 'garnaas',
            firstName: 'Ane Min Hofplass',
            lastName: 'Garnaas',
            fullName: 'Ane Min Hofplass Garnaas',
            gender: 'female',
            profilePicture:
              'https://thumbor.abakus.no/t7vb8MiIDeAx0QeQViWrWIAT_2A=/200x200/default_female_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 417,
          user: {
            id: 15,
            username: 'tormunds',
            firstName: 'Tormund Sandve',
            lastName: 'Haus',
            fullName: 'Tormund Sandve Haus',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 416,
          user: {
            id: 14,
            username: 'marthola',
            firstName: 'Martin Rudi',
            lastName: 'Holaker',
            fullName: 'Martin Rudi Holaker',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 415,
          user: {
            id: 13,
            username: 'krstr',
            firstName: 'Kristoffer Tveit',
            lastName: 'Strømmen',
            fullName: 'Kristoffer Tveit Strømmen',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 414,
          user: {
            id: 12,
            username: 'knuthask',
            firstName: 'Knut Halvor',
            lastName: 'Skrede',
            fullName: 'Knut Halvor Skrede',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 413,
          user: {
            id: 11,
            username: 'karstenp',
            firstName: 'Karsten Peder',
            lastName: 'Holth',
            fullName: 'Karsten Peder Holth',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 412,
          user: {
            id: 10,
            username: 'runeblek',
            firstName: 'Rune Bleken',
            lastName: 'Kulstad',
            fullName: 'Rune Bleken Kulstad',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 45,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        }
      ]
    },
    {
      id: 44,
      name: 'Abakus',
      capacity: 15,
      activationDate: '2017-05-05T12:00:00Z',
      permissionGroups: [
        {
          id: 2,
          name: 'Abakus',
          description: 'Medlemmer av Abakus',
          parent: null
        }
      ],
      registrations: [
        {
          id: 411,
          user: {
            id: 9,
            username: 'einerkja',
            firstName: 'Fredrik Prinsdal',
            lastName: 'Einerkjær',
            fullName: 'Fredrik Prinsdal Einerkjær',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 410,
          user: {
            id: 8,
            username: 'torborgs',
            firstName: 'Torborg Skjevdal',
            lastName: 'Hansen',
            fullName: 'Torborg Skjevdal Hansen',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 409,
          user: {
            id: 7,
            username: 'hoiby',
            firstName: 'Ola',
            lastName: 'Høiby',
            fullName: 'Ola Høiby',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 408,
          user: {
            id: 6,
            username: 'hansanf',
            firstName: 'Hans Andreas',
            lastName: 'Fay',
            fullName: 'Hans Andreas Fay',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 407,
          user: {
            id: 5,
            username: 'fredriry',
            firstName: 'Fredrik',
            lastName: 'Rydland',
            fullName: 'Fredrik Rydland',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 406,
          user: {
            id: 4,
            username: 'andenor',
            firstName: 'Anders',
            lastName: 'Nore',
            fullName: 'Anders Nore',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 405,
          user: {
            id: 3,
            username: 'stalepe',
            firstName: 'Ståle',
            lastName: 'Pettersen',
            fullName: 'Ståle Pettersen',
            gender: 'male',
            profilePicture:
              'https://thumbor.abakus.no/vTeRbni7WlbNvx1nmEbALGOAOSg=/200x200/default_male_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        },
        {
          id: 404,
          user: {
            id: 2,
            username: 'bedkom',
            firstName: 'bedkom',
            lastName: 'bedkom',
            fullName: 'bedkom bedkom',
            gender: '',
            profilePicture:
              'https://thumbor.abakus.no/t7vb8MiIDeAx0QeQViWrWIAT_2A=/200x200/default_female_avatar.png'
          },
          pool: 44,
          feedback: null,
          status: 'SUCCESS_REGISTER'
        }
      ]
    }
  ],
  feed: {
    type: 'user',
    activities: [1494079697000, 1493813233000, 1493380734000]
  },
  feedItems: [
    {
      id: 1494079697000,
      verb: 'comment',
      createdAt: '2017-05-06T14:08:17.385000Z',
      updatedAt: '2017-05-06T14:08:17.385000Z',
      lastActivity: {
        time: '2017-05-06T14:08:17.385730Z',
        extraContext: { content: '<p>kjk</p>' },
        actor: 'users.user-1',
        object: 'comments.comment-42',
        target: 'quotes.quote-2'
      },
      activities: [
        {
          time: '2017-05-06T14:08:17.385730Z',
          extraContext: { content: '<p>kjk</p>' },
          actor: 'users.user-1',
          object: 'comments.comment-42',
          target: 'quotes.quote-2'
        }
      ],
      activityCount: 1,
      actorIds: [1],
      context: {
        'users.user-1': {
          id: 1,
          username: 'webkom',
          firstName: 'webkom',
          lastName: 'webkom',
          profilePicture:
            'https://thumbor.abakus.no/w6YlrMEnKtG5csWLw-CjZntR-VA=/100x100/abakus_webkom_6J9lYCU.png',
          contentType: 'users.user'
        }
      }
    },
    {
      id: 1493813233000,
      verb: 'comment',
      createdAt: '2017-05-03T12:07:13.874000Z',
      updatedAt: '2017-05-03T12:07:13.874000Z',
      lastActivity: {
        time: '2017-05-03T12:07:13.874167Z',
        extraContext: { content: '<p>KEKE</p><br/>' },
        actor: 'users.user-1',
        object: 'comments.comment-39',
        target: 'events.event-20'
      },
      activities: [
        {
          time: '2017-05-03T12:07:13.874167Z',
          extraContext: { content: '<p>KEKE</p><br/>' },
          actor: 'users.user-1',
          object: 'comments.comment-39',
          target: 'events.event-20'
        }
      ],
      activityCount: 1,
      actorIds: [1],
      context: {
        'events.event-20': {
          id: 20,
          title: 'Eksamenskurs i Java',
          eventType: 'course',
          contentType: 'events.event'
        },
        'users.user-1': {
          id: 1,
          username: 'webkom',
          firstName: 'webkom',
          lastName: 'webkom',
          profilePicture:
            'https://thumbor.abakus.no/w6YlrMEnKtG5csWLw-CjZntR-VA=/100x100/abakus_webkom_6J9lYCU.png',
          contentType: 'users.user'
        }
      }
    },
    {
      id: 1493380734000,
      verb: 'comment',
      createdAt: '2017-04-28T00:51:36.706000Z',
      updatedAt: '2017-04-28T11:58:54.099000Z',
      lastActivity: {
        time: '2017-04-28T11:58:54.099537Z',
        extraContext: { content: '<p>gay</p>' },
        actor: 'users.user-1',
        object: 'comments.comment-21',
        target: 'events.event-15'
      },
      activities: [
        {
          time: '2017-04-28T00:51:36.706414Z',
          extraContext: { content: '<p>Hei på deg</p>' },
          actor: 'users.user-1',
          object: 'comments.comment-18',
          target: 'events.event-15'
        },
        {
          time: '2017-04-28T11:58:54.099537Z',
          extraContext: { content: '<p>gay</p>' },
          actor: 'users.user-1',
          object: 'comments.comment-21',
          target: 'events.event-15'
        }
      ],
      activityCount: 2,
      actorIds: [1],
      context: {
        'events.event-15': {
          id: 15,
          title: 'Eksamensfest',
          eventType: 'party',
          contentType: 'events.event'
        },
        'users.user-1': {
          id: 1,
          username: 'webkom',
          firstName: 'webkom',
          lastName: 'webkom',
          profilePicture:
            'https://thumbor.abakus.no/w6YlrMEnKtG5csWLw-CjZntR-VA=/100x100/abakus_webkom_6J9lYCU.png',
          contentType: 'users.user'
        }
      }
    }
  ]
};
