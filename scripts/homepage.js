var app = angular.module('homepage', ['ngMaterial']);

app.config(function($mdThemingProvider) { $mdThemingProvider.theme('default') .warnPalette('red') .accentPalette('deep-orange'); });

var onClick = function(url) {
  window.open(url);
};

app.controller('AboutCtrl', function($scope) {
    $scope.info = [
      {
        section : 'Summary',
        image : 'https://www.gravatar.com/avatar/4d57fcd9437881455dbfd1921556d8b7?s=300',
        width : 300, 
        height : 300,
        tooltip : 'Hello there',
        subheader : "Shawn Blakesley: Software Engineer",
        summary : [
          { text : 'I\'ve been programming professionally for 4 years, and non-professionally for 12 years now.'},
          { text : 'It all started twelve years ago (cue film noir setting) when I taught myself how to program using flash actionscript in order to make games and share them with friends. When I started college, I quickly fell in love with Java (because that was the language of the school), and I competed in and won two of the local programming contests. When I started using C++11 & 14 with Boost C++ at Volcano, it quickly became my favorite language. I started at Enplug with no experience in Android, and I developed multiple Android apps for digital signage. I also developed the OpenGL Video Player and Browser Support using the Java Native Interface to integrate C libraries into Java for the Enplug SDK.'},
          { text : 'I am passionate about sharing my love of programming and problem-solving with novice programmers, and I take every opportunity to help others to learn. I feel at home with many different languages, and I am constantly learning new ones for fun.'},
        ], 
      },
      {
        section : 'Skills',
        // summary : [
        //   { text : 'I find different languages and libraries to be the best for different situations, so I have used many. This list only includes languages and libraries I multiple years of experience in.'},
        // ],
        skills : [
            {
              name : 'Languages',
              chips : [
                  {
                    name : 'C++11/14'
                  },
                  {
                    name : 'Java'
                  },
                  {
                    name : 'C#'
                  },
                  {
                    name : 'C'
                  },
                  {
                    name : 'JavaScript'
                  },
                  {
                    name : 'Perl'
                  },
                  {
                    name : 'Python'
                  },
                  {
                    name : 'GLSL'
                  },
                  {
                    name : 'CMake'
                  },
                ],
            },
            {
              name : 'Libraries',
              chips : [
                  {
                    name : 'OpenGL'
                  },
                  {
                    name : 'Qt'
                  },
                  {
                    name : 'FFMpeg'
                  },
                  {
                    name : 'Android SDK'
                  },
                  {
                    name : 'OpenCV'
                  },
                  {
                    name : 'Boost C++'
                  },
                  {
                    name : 'AngularJS'
                  },
                  {
                    name : 'NodeJS'
                  },
                  {
                    name : 'LibGDX'
                  },
                ],
            },
            {
              name : 'Tools',
              chips : [
                  {
                    name : 'Visual Studio'
                  },
                  {
                    name : 'Unity 3D'
                  },
                  {
                    name : 'IntelliJ'
                  },
                  {
                    name : 'Android Studio'
                  },
                  {
                    name : 'Eclipse'
                  },
                  {
                    name : 'Cygwin'
                  },
                  {
                    name : 'Github'
                  },
                  {
                    name : 'Perforce'
                  },
                ],
            },
            {
              name : 'Operating Systems',
              chips : [
                  {
                    name : 'Windows',
                  },
                  {
                    name : 'Linux',
                  },
                  {
                    name : 'Android',
                  },
                ],
            },
            {
              name : 'Concentrations',
              chips : [
                  {
                    name : 'Graphics'
                  },
                  {
                    name : 'Game Programming'
                  },
                  {
                    name : 'Artificial Intelligence'
                  },
                  {
                    name : 'Security'
                  },
                ],
            },
          ],
      },
      {
        section : 'Projects',
        summary : [
          { text : 'A list of projects and my contributions from work and education'},
        ],
        projects : [
            {
              title : 'Browser Support (Windows & Android)',
              detail : 'Designed and developed JNI interface to render browsers in OpenGL',
              chips : [
                  {
                    name : 'C++'
                  },
                  {
                    name : 'Java'
                  },
                  {
                    name : 'JNI'
                  },
                  {
                    name : 'LibGDX'
                  },
                  {
                    name : 'OpenGL'
                  },
                  {
                    name : 'Android'
                  },
                ],
            },
            {
              title : 'LibGDX Video Renderer (Windows & Android & Mac)',
              detail : 'Designed and developed video renderer using ffmpeg and libgdx',
              chips : [
                  {
                    name : 'C'
                  },
                  {
                    name : 'Java'
                  },
                  {
                    name : 'FFmpeg'
                  },
                  {
                    name : 'LibGDX'
                  },
                  {
                    name : 'OpenGL'
                  },
                  {
                    name : 'Android'
                  },
                  {
                    name : 'OpenCV'
                  },
                ],
            },
            {
              title : 'Enplug Splashscreen',
              detail : 'Designed and developed splashscreen',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'LibGDX'
                  },
                ],
            },
            {
              title : 'RSS App',
              detail : 'Sole ownership of app for Enplug displays',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'LibGDX'
                  },
                  {
                    name : 'JSON'
                  },
                ],
            },
            {
              title : 'Webpage App',
              detail : 'Sole ownership of app for Enplug displays',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'LibGDX'
                  },
                ],
            },
            {
              title : 'Natives Loader',
              detail : 'Created system for updating and loading native libraries',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'DLLs'
                  },
                ],
            },
            {
              title : 'Android Control App',
              detail : 'App to control Enplug displays on Android',
              chips : [
                  {
                    name : 'Android'
                  },
                  {
                    name : 'Java'
                  },
                ],
            },
            {
              title : 'Build Server',
              detail : 'Set up, maintained and ran build servers for Enplug',
              chips : [
                  {
                    name : 'Deployment'
                  },
                  {
                    name : 'Automation'
                  },
                  {
                    name : 'Testing'
                  },
                ],
            },
            {
              title : 'Webpage Extension Apps',
              detail : 'Developed SDK used by multiple apps for Enplug displays',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'Android'
                  },
                ],
            },
            {
              title : 'IVUS on OFact',
              detail : 'Statechart design and implementation',
              chips : [
                  {
                    name : 'C++11/14'
                  },
                  {
                    name : 'Boost C++'
                  },
                ],
            },
            {
              title : 'Automated Test System',
              detail : 'Design, documentation and implementation',
              chips : [
                  {
                    name : 'Perl'
                  },
                  {
                    name : 'C++'
                  },
                ],
            },
            {
              title : 'Build System',
              detail : 'Maintained and extended CMake macros',
              chips : [
                  {
                    name : 'CMake'
                  },
                ],
            },
            {
              title : 'ZLife: 2D Zombie Path-finding',
              detail : 'Designed graphical representation and path-finding AI',
              chips : [
                  {
                    name : 'Java'
                  },
                ],
            },
            {
              title : 'CSUS Senior Project',
              detail : 'Project Lead',
              chips : [
                  {
                    name : 'C#'
                  },
                ],
            },
            {
              title : '3D Candy Collector Game',
              detail : 'Headed UI and 3D graphics engine',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'JOGL'
                  },
                  {
                    name : 'OpenGL'
                  },
                ],
            },
            {
              title : 'OpenGL 3D Engine',
              detail : 'Created engine using JOGL',
              chips : [
                  {
                    name : 'Java'
                  },
                  {
                    name : 'JOGL'
                  },
                  {
                    name : 'OpenGL'
                  },
                ],
            },
            {
              title : 'Steganographic Encoder',
              detail : 'Developed user interface and encoding algorithm',
              chips : [
                  {
                    name : 'Java'
                  },
                ],
            },
          ],
      },
      {
        section : 'Trivia',
        bullets : [
            {
              detail : 'Undefeated CSUS programming contest champion for two years'
            },
            {
              detail : 'My picture appears in Marie Claire UK April 2015'
            },
            {
              detail : 'Married on Ultimate Pi Day (3/14/15)'
            },
            {
              detail : 'Fan of Dungeons & Dragons, board games, musicals, Star Trek, Doctor Who, and many more'
            },
            {
              detail : 'Earned the nicknames \'Batman\' and \'Sunshine\' for working at extremely late hours and still being peppy in the morning meetings'
            },
          ],
      },
    ];
});

app.controller('JobsCtrl', function($scope) {
    $scope.jobs = [
      {
        company : 'Enplug',
        title : 'Senior Software Engineer',
        dates : '(April 2014 - September 2015)',
        url : 'https://www.enplug.com/',
        logo : 'images/enplug_logo.png',
        alt : 'Enplug Spotlight',
        tooltip : 'Enplug Spotlight',
        width : 196, 
        height : 206,
        summary : [
          { 
            text : 'Enplug Inc. is a Los Angeles startup that provides an app-based digital signage solution. Enplug has been recognized by Time, Fortune, Marie Claire, Inc., and Money magazines along with many more print and internet publications for being a leader in the field of digital signage.',
          },
          {
            text : 'As a Senior Software Engineer at Enplug, I had a high-expectation job with a wide range of responsibilities. I enjoyed the fast-paced startup nature because there was never a lack of tasks to focus on. My primary responsibility was to develop new technologies for the Enplug SDK such as the video renderer and adding browser support. On top of that, I designed, developed and deployed two apps, maintained a third, ran the build system, worked on the android mobile control app, supported the development of all webpage-based external apps and many more tasks. Because we had a small engineering team with a high-visibility product that needs to run smoothly 24/7, I had a hand in too many tasks to list.',
          },
          {
            text : 'While 95% of my work was done remotely from Northern California, I was also recognized for my contributions to company life. I was highlighted in an employee spotlight blog post and mentioned by Nanxi Liu (the CEO) in an article about company culture. I invited the entire team to my wedding, and half of them (including Nanxi) drove up to San Francisco for the celebration.',
          },
        ], 
        links : [
          {
            url : 'https://www.enplug.com/blog/enplug-spotlight-shawn-software-engineer',
            name : 'Employee Spotlight',
          },
          {
            url : 'https://www.linkedin.com/pulse/8-real-ways-we-built-family-culture-our-company-nanxi-liu',
            name : 'Company Culture',
          },
        ],
      },
      {
        company : 'Volcano',
        title : 'Software Engineer 2',
        dates : '(June 2012 - January 2014)',
        url : 'http://www.volcanocorp.com',
        tooltip : 'Volcano',
        logo : 'images/volcano_logo.png',
        alt : 'Volcano Logo', 
        width : 243,
        height : 46,
        summary : [
          { text : 'I had the opportunity to work with a group of highly skilled, awesome people developing modern C++ applications for intravascular ultrasounds. My primary role was as a developer on the Maestro team (which was the newest platform being developed at Volcano) and as the sole owner of the CMake Macros. I also collaborated with the build team on an automated test system and the company\'s CMake Macros. In November, a principle software engineer recognized me with a company-wide "Heads Up" award nomination for finding a solution for optimizing the design of our statechart library.',}
        ]
      },
      {
        company : 'ITest',
        title : 'Head Instructor',
        dates : '(Summer 2013)',
        url : 'https://www.ecs.csus.edu/itest',
        tooltip : 'ITest',
        logo : 'images/itest.jpg',
        alt : 'ITest Picture', 
        width : 300,
        height : 200,
        summary : [
          { text : 'I was chosen by one of my professors to be the head instructor of a collaborative effort between CSU Sacramento and the surrounding school districts to teach game programming to inner city high school students. Under my supervision and assistance, the McClatchy High School students successfully created an educational computer game in Greenfoot, and the game was deployed to local elementary schools in the same district.',}
        ]
      },
      {
        company : 'PARC CSU Sacramento',
        title : 'Adjunct Instructor',
        dates : '(Fall 2011 - Spring 2013)',
        url : 'http://www.csus.edu/parc',
        tooltip : 'Peer and Academic Resource Center',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo', 
        width : 121,
        height : 184,
        summary : [
          { text : 'I was selected by professors at CSUS to teach a pair of introductory java adjunct courses. Students enrolled in Proramming Concepts and Methodology I and II had the option of signing up for a concurrent course taught by myself. For five semesters, I created dynamic lessons to supplement the professors\' lectures, worked one-on-one with students during office hours, and collaborated with faculty to achieve maximum student comprehension. I also worked with Computer Science department faculty to promote diversity and inclusivity within the engineering culture at CSUS.',}
        ]
      },
    ];
});



app.controller('EduCtrl', function($scope) {
    $scope.education = [
      {
        school : 'CSUS',
        degree : 'Masters Coursework',
        field : 'Computer Science',
        dates : '(2011 - 2013)',
        link : 'http://www.csus.edu/',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo',
        width : 121,
        height : 184,
        bullets : [
            {
              detail : 'Primary concentration in artificial intelligence with a secondary concentration in security'  
            },
            {
              detail : 'Designed graphical representation and AI for 2D Java zombie path-finding project'
            },
            {
              detail : 'Developed algorithms and interface for Java steganographic encoder'
            },
            {
              detail : 'Taught summer programming course to high school students for masters project'
            },
          ],
      },
      {
        school : 'CSUS',
        degree : 'Bachelors',
        field : 'Computer Science',
        dates : '(2007-2011)',
        link : 'http://www.csus.edu/',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo',
        width : 121,
        height : 184,
        bullets : [
            {
              detail : 'Programmed Java OpenGL 3D Engine'
            },
            {
              detail : 'Headed UI and graphics for 3D Candy Collector Game using Java and OpenGL'
            },
            {
              detail : 'Project lead on Crime Event Mapping System for Sacramento Homicide Department (as Senior Project) using C# and Bing Maps API'
            },
            {
              detail : 'Created Schmesh (chess-like) game playing AI and placed 7 in class competition'
            },
            {
              detail : 'Undefeated champion of the acm programming contest for two years'
            },
          ],
      },
      {
        school : 'CSUS',
        degree : 'Minor',
        field : 'Physics',
        dates : '(2007-2011)',
        link : 'http://www.csus.edu/',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo',
        width : 121,
        height : 184,
        bullets : [
            {
              detail : 'Used Wolfram Mathematica to solve complex physics problems'
            },
            {
              detail : 'Wrote Fortran code to solve parametric equations'
            },
            {
              detail : 'Took advanced courses in simulations, optics and modern physics'
            },
          ],
      },
    ];
});

app.controller('SamplesCtrl', function($scope) {
    $scope.samples = [
      {
        title : 'WebGL Shader',
        link : 'webgl.html',
        image : 'images/webgl.png',
        width : 960, 
        height : 540,
        summary : 'A toon-shaded procedurally generated texture using a glsl shader in webGL. I made this using my knowledge of shaders, and a Udacity tutorial to learn how to incorporate that into WebGL. Given time I plan to add more shaders to this example.',
        launchText : 'Launch',
        chips : [
            {
              name : 'JavaScript'
            },
            {
              name : 'WebGL'
            },
            {
              name : 'GLSL'
            },
            {
              name : 'Three.js'
            },
          ],
      },
      {
        title : 'This Website',
        link : 'https://shawnblakesley.github.com',
        image : 'https://www.gravatar.com/avatar/4d57fcd9437881455dbfd1921556d8b7?s=300',
        width : 300, 
        height : 300,
        summary : 'Designed and developed with Angular Material because I\'m a big fan of material design. Feel free to browse the code on Github. I\'m not predominantly a web developer, but I don\'t like leaving gaps in my knowledge. I\'ve always tried to keep up with the web as much as possible in my free time.',
        launchText : 'Launch',
        chips : [
            {
              name : 'JavaScript'
            },
            {
              name : 'HTML'
            },
            {
              name : 'CSS'
            },
            {
              name : 'AngularJS'
            },
          ],
      },
      {
        title : 'Unity Game',
        link : 'unityPlatformer.html',
        width : 196, 
        height : 206,
        summary : 'Currently making a small game to get better acquainted with Unity.',
        launchText : 'Coming Soon',
        chips : [
            {
              name : 'Unity'
            },
            {
              name : 'C#'
            },
          ],
      },
      {
        title : 'C++ Demo',
        width : 200, 
        height : 200,
        summary : 'Still planning a C++ Demo',
        launchText : 'Coming Soon',
        chips : [
            {
              name : 'C++11/14'
            },
            {
              name : 'OpenGL'
            },
          ],
      },
    ];
});