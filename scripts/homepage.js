var app = angular.module('homepage', ['ngMaterial']);

app.config(function($mdThemingProvider) { $mdThemingProvider.theme('default') .accentPalette('deep-orange'); });

var onClick = function(url) {
  window.open(url);
};

app.controller('AboutCtrl', function($scope) {
    $scope.info = [
      {
        section : 'Summary',
        image : 'https://www.gravatar.com/avatar/4d57fcd9437881455dbfd1921556d8b7?s=200',
        width : 196, 
        height : 206,
        tooltip : 'Hello there',
        summary : [
          { text : 'It all started ten years ago (cue film noir setting) when I taught myself how to program using flash actionscript in order to make games and share them with friends. When I started college, I quickly fell in love with Java (because that was the language of the school), and I competed in and won two of the local programming contests. When I started using C++11 and boost at Volcano, I became hooked instantly.'},
          { text : 'I am passionate about sharing my love of code and problem-solving with future generations of programmers, and I take every opportunity to share that love. I feel at home with many different languages, and I find learning a new language to be one of the most entertaining parts of programming.'},
        ] 
      },
      {
        section : 'Skills',
        summary : [
          { text : 'C++11/14, Java, OpenGL, FFMpeg, JavaScript, CSS, HTML, '},
        ] 
      },
    ];
});

app.controller('JobsCtrl', function($scope) {
    $scope.jobs = [
      {
        company : 'Enplug',
        title : 'Senior Software Engineer',
        dates : '(April 2014 - September 2015)',
        link : 'https://www.enplug.com',
        logo : 'images/enplug_logo.png',
        alt : 'Enplug Logo',
        tooltip : 'Enplug',
        width : 196, 
        height : 206,
        summary : 'As a Senior Software Engineering at Enplug, I was responsible for creating and maintaining software for the Enplug Display Unit. This ranged from refactoring the android-specific platform the player ran on top of to creating new applications to be displayed on the screen.'
      },
      {
        company : 'Volcano',
        title : 'Software Engineer 2',
        dates : '(June 2012 - January 2014)',
        link : 'http://www.volcanocorp.com',
        tooltip : 'Volcano',
        logo : 'images/volcano_logo.png',
        alt : 'Volcano Logo', 
        width : 243,
        height : 46,
        summary : 'I had the opportunity to work with a group of highly skilled, awesome people developing modern C++ applications for intravascular ultrasounds. My primary role was as a developer on the Maestro team (which was the newest platform being developed at Volcano) and as the sole owner of the CMake Macros. I also collaborated with the build team on an automated test system and the company\'s CMake Macros. In November, a principle software engineer recognized me with a company-wide "Heads Up" award nomination for finding a solution for optimizing the design of our statechart library.'
      },
      {
        company : 'ITest',
        title : 'Head Instructor',
        dates : '(Summer 2013)',
        link : 'https://www.ecs.csus.edu/itest',
        tooltip : 'ITest',
        logo : 'images/itest.jpg',
        alt : 'ITest Picture', 
        width : 300,
        height : 200,
        summary : 'I was chosen by one of my professors to be the head instructor of a collaborative effort between CSU Sacramento and the surrounding school districts to teach game programming to inner city high school students. Under my supervision and assistance, the McClatchy High School students successfully created an educational computer game in Greenfoot, and the game was deployed to local elementary schools in the same district.'
      },
      {
        company : 'PARC CSU Sacramento',
        title : 'Adjunct instructor',
        dates : '(Fall 2011 - Spring 2013)',
        link : 'http://www.csus.edu/parc',
        tooltip : 'Peer and Academic Resource Center',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo', 
        width : 121,
        height : 184,
        summary : 'I was selected by professors at CSUS to teach a pair of introductory java adjunct courses. Students enrolled in Proramming Concepts and Methodology I and II had the option of signing up for a concurrent course taught by myself. For five semesters, I created dynamic lessons to supplement the professors\' lectures, worked one-on-one with students during office hours, and collaborated with faculty to achieve maximum student comprehension. I also worked with Computer Science department faculty to promote diversity and inclusivity within the engineering culture at CSUS.'
      },
    ];
});



app.controller('EduCtrl', function($scope) {
    $scope.education = [
      {
        school : 'CSU Sacramento',
        degree : 'Masters Coursework in Computer Science',
        dates : '(2011 - 2013)',
        link : 'http://www.csus.edu/',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo', 
        width : 200,
        height : 184,
        bullets : [
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
        school : 'CSU Sacramento',
        degree : 'Bachelors in Computer Science',
        dates : '(2007-2011)',
        link : 'http://www.csus.edu/',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo', 
        width : 200,
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
        school : 'CSU Sacramento',
        degree : 'Minor in Physics',
        dates : '(2007-2011)',
        link : 'http://www.csus.edu/',
        logo : 'images/csus_logo.png',
        alt : 'CSUS Logo', 
        width : 200,
        height : 184,
        bullets : [
            {
              detail : 'Used Wolfram Mathematica to solve complex physics problems'
            },
            {
              detail : 'Wrote Fortran code to solve parametric equations'
            },
          ],
      },
    ];
});

app.controller('SamplesCtrl', function($scope) {
    $scope.samples = [
      {
        title : 'My Website',
        link : 'https://shawnblakesley.github.com',
        image : 'images/website.png',
        width : 196, 
        height : 206,
        summary : 'TODO',
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
          ],
      },
      {
        title : 'Unity Platformer',
        link : 'unityPlatformer.html',
        image : 'images/platformer.png',
        width : 196, 
        height : 206,
        summary : 'TODO',
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
        title : 'Three.js WebGL Shader Demo',
        link : 'webgl.html',
        image : 'images/webgl.png',
        width : 196, 
        height : 206,
        summary : 'TODO',
        launchText : 'Converting from old website',
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
          ],
      },
    ];
});