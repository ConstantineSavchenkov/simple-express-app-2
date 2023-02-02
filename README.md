# Notes from position candidate about challenge and algorithm  

Hello, first of all, thank you for the opportunity! I liked your recruitment challenge. 
Unforchintley, because of the load with other recruitment challenges and technical interviews I had only two days to complete your task but I think did well enough and cover most of the requirements. 

For the parts that I did not cover I left todo notes, most of them tidy tasks but some of them an important
like mocking 3 party API in tests or lack of decent logging strategy.

The core part of this recruitment challenge is the k nearest driving destination query. I decided that using only third-party web API for ordering rows will be too inefficient. Even 120 farms from the seed script would 
cause sending 120 dots to some far-far away API and 120 is almost nothing for this setup, so I started looking for a way 
that helps minimize API calls. That's how I came up with the idea to use geoGist to sort dots locally by 
nearest destinations (not driving but geo destination which is closely related to driving destination) and by using a little bit broader ranges than the user querring feed them to web API and provide accurate data back. 

The realization of this idea with distancematrix.io did not succeeded because for some reason this service throttles my calls and allows me to use only one destination for origin which is not suitable for my purpose.
I abandoned this ordering optimization in feature/farm-task-driving-opt because I run out of time for this recruitment challenge.

Aside from this difference in driving and geo destination everything else is in master and should work fine.

Thank you, if you managed to read that far)

# Where is the code exercises? 
in /src/codeExercises.ts and /src/codeExercises.spec.ts tests for them 
# Where is the seed script?
It's in /src/helpers/seeding. I created it for using in tests but this set up can easily be 
switched for cli usage 

# Did you changes composer yaml? 
Yes, I changed postgree to postgree + geoGis extensions





