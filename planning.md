# TO DO
- Add README
- Turn into plugin for easy use in new projects
- Release dependency on keypress.js
- Figure out how to handle multiple, fast key strokes
    - Proposal: listen for number of key strokes, and then animate based on that... (maybe?)
    - Perhaps a throttle?
- Slight problem: it SHOULD be that the most recent target should have the highest z-index
- Quickly switching right and then left. Doesn't work! I need a better way to control quick key inputs. Like... have the switches be functions that have a parameter, and have the key events just count what number to pass to the functions. Still, I like the idea of the action being fairly instantaneous



# STRUCTURE

first level --> progression is by siblings
second level --> tangents are by children
third level --> 


structure
1 -
2  |- all connected by R/L
3  |- all slides in progression
4 -


1 ---------------------------------
 a. tangent -                      |
 b. tangent  |- connected by U/D   |- connected by R/L in the origin scope
 c. tangent -                      |
2 ---------------------------------
3
4


1 ----------
 a. tangent  (press down to get here from 1)
   i. prog of tan (press right to get here from 1.a)
      • tangent of prog of tan (press down to get here from 1.a.i)
   ii. prog of tan (press right to get here from 1.a.i)
   iii. prog of tan (press right to get here from 1.a.ii)
 b. tangent  (press down to get here from 1.a)
 c. tangent (press down to get here from 1.b)
2 (press right to get here from 1)
3
4

At any point, right progress you through an idea (next sibling in a container)
and down brings you on a tangent (first child)