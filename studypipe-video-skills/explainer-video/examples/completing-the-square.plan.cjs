// Completing the square explainer plan (director output, schema v1). Build: node scripts/build.cjs examples/completing-the-square.plan.cjs
// DIRECTOR AGENT OUTPUT — "Completing the Square" explainer plan (schema v1)
// The video skill consumes this. The model writes data only; the player performs it.
// Colour roles: b = coefficient of x, h = half of it, sq = the added square
const B = s => `\\htmlClass{role-b}{${s}}`, H = s => `\\htmlClass{role-h}{${s}}`, S = s => `\\htmlClass{role-sq}{${s}}`;

const CS = { id: 'cs', x: [-8, 2, 2], y: [-16, 15, 4], xlabel: 'x', ylabel: 'y', items: [
  { id: 'curve', type: 'fn', fn: 'x*x + 6*x - 2', domain: [-8, 2], color: 'amber', label: 'y = x² + 6x − 2', labelAt: [-7.6, 13] },
  { id: 'vguide', type: 'guide', at: [-3, -11], color: 'green' },
  { id: 'vertex', type: 'point', at: [-3, -11], color: 'green', label: 'minimum (−3, −11)', pos: 's' },
  { id: 'roots', type: 'points', pts: [[-3 - Math.sqrt(11), 0], [-3 + Math.sqrt(11), 0]], labels: ['≈ −6.32', '≈ 0.32'], color: 'sky', pos: 'n' }] };

module.exports = {
  meta: {
    title: 'Completing the Square', subtitle: 'Solving quadratic equations, step by step', eq: 'x² + bx + c = 0 → (x + p)² = q',
    subject: 'Mathematics', level: 'SS2–SS3 · WAEC / NECO / JAMB', theme: 'vegetation',
    roles: { b: { color: 'amber', name: 'coefficient of x' }, h: { color: 'sky', name: 'half of it' }, sq: { color: 'green', name: 'the square added' } }
  },

  // facts the build must verify numerically before anything is rendered
  checks: [
    { name: 'Ex1 roots satisfy x²+6x−2=0', f: x => x * x + 6 * x - 2, roots: [-3 + Math.sqrt(11), -3 - Math.sqrt(11)] },
    { name: 'Ex1 decimals', approx: [[-3 + Math.sqrt(11), 0.32], [-3 - Math.sqrt(11), -6.32]] },
    { name: 'Ex1 square form', same: [x => x * x + 6 * x - 2, x => (x + 3) ** 2 - 11] },
    { name: 'Perfect square expansion', same: [x => (x + 3) ** 2, x => x * x + 6 * x + 9] },
    { name: 'Ex2 roots satisfy 2x²−8x+3=0', f: x => 2 * x * x - 8 * x + 3, roots: [2 + Math.sqrt(2.5), 2 - Math.sqrt(2.5)] },
    { name: 'Ex2 decimals', approx: [[2 + Math.sqrt(2.5), 3.58], [2 - Math.sqrt(2.5), 0.42]] },
    { name: 'Ex2 square form', same: [x => x * x - 4 * x + 1.5, x => (x - 2) ** 2 - 2.5] },
    { name: 'Practice roots satisfy x²−10x+7=0', f: x => x * x - 10 * x + 7, roots: [5 + 3 * Math.sqrt(2), 5 - 3 * Math.sqrt(2)] },
    { name: '√18 = 3√2', approx: [[Math.sqrt(18), 3 * Math.sqrt(2)]] },
    { name: 'Quadratic formula (random a,b,c)', formula: true }
  ],

  chapters: [
    { title: 'Why complete the square?', cues: [
      { say: "Welcome. In this lesson, we'll master one of the most useful methods in algebra: completing the square.", ops: [{ clear: 'Completing the square' }] },
      { say: "Look at this equation. x squared, plus six x, minus two, equals zero.", ops: [{ write: 'e1', tex: 'x^2 + 6x - 2 = 0' }] },
      { say: "Can we factorise it? We need two numbers that multiply to give minus two, and add up to six. No whole numbers do that.", ops: [{ write: 'e2', tex: '\\text{factors of } -2:\\ \\ (1,\\,-2),\\ \\ (-1,\\,2)', note: 'none add up to 6' }] },
      { say: "So factorisation fails. But completing the square works for every quadratic equation, whether it factorises or not.", ops: [] },
      { say: "The idea is simple. We rewrite the equation in the form: x plus p, all squared, equals q. Then we just take square roots.", ops: [{ write: 'goal', tex: '(x + p)^2 = q', note: 'our target' }, { box: 'goal' }] }
    ] },
    { title: 'Perfect squares', cues: [
      { say: "First, let's see what a perfect square looks like. Let's expand x plus three, all squared.", ops: [{ clear: 'Perfect squares' }, { write: 'p1', tex: '(x + 3)^2 = (x + 3)(x + 3)' }] },
      { say: "That gives x squared, plus three x, plus three x, plus nine. Which is x squared, plus six x, plus nine.", ops: [{ write: 'p2', tex: '= x^2 + 3x + 3x + 9' }, { write: 'p3', tex: `= x^2 + ${B('6')}x + ${S('9')}`, at: 2.6 }] },
      { say: "Notice the pattern. The six is two times three. And the nine is three squared.", ops: [{ hl: ['b', 'sq'] }] },
      { say: "In general, x plus a, all squared, equals x squared, plus two a x, plus a squared.", ops: [{ write: 'g1', tex: `(x + a)^2 = x^2 + ${B('2a')}x + ${S('a^2')}` }] },
      { say: "So here is the key rule. To complete the square, take half of the coefficient of x, and square it.", ops: [{ write: 'rule', tex: `\\text{add}\\ \\left(\\frac{${B('\\text{coefficient of } x')}}{2}\\right)^{2}`, note: 'half it, then square it' }, { box: 'rule' }, { hl: ['b'] }] }
    ] },
    { title: 'Seeing it as a real square', cues: [
      { say: "Why is it called completing the square? Let's see it as an actual square. Here is a square with sides of length x. Its area is x squared.", ops: [{ clear: 'Seeing it as a square' }, { panel: 'area', s: { stage: 0, b: 6 } }, { write: 'v1', tex: '\\text{area} = x^2' }] },
      { say: "Now we add six x. That's a rectangle, x long and six wide.", ops: [{ panel: 'area', s: { stage: 1, b: 6 } }, { write: 'v2', tex: `x^2 + ${B('6')}x` }] },
      { say: "Split this rectangle down the middle into two strips. Each strip is x by three.", ops: [{ panel: 'area', s: { stage: 2, b: 6 } }, { write: 'v3', tex: `${B('6')}x = ${H('3')}x + ${H('3')}x` }] },
      { say: "Move one strip to the right side of the square, and the other strip underneath it.", ops: [{ panel: 'area', s: { stage: 3, b: 6 } }] },
      { say: "Now look at the corner. There's a gap. A small square, three by three. Its area is nine. That's the missing piece.", ops: [{ panel: 'area', s: { stage: 4, b: 6 } }, { write: 'v4', tex: `\\text{missing corner} = ${H('3')}^2 = ${S('9')}` }] },
      { say: "Add that nine, and we have completed the square. A big square with sides x plus three. So x squared, plus six x, plus nine, equals x plus three, all squared.", ops: [{ panel: 'area', s: { stage: 5, b: 6 } }, { write: 'v5', tex: `x^2 + ${B('6')}x + ${S('9')} = (x + ${H('3')})^2` }, { box: 'v5' }] },
      { say: "Half of six is three. Three squared is nine. The rule we learned is simply the missing corner of the square.", ops: [{ hl: ['h', 'sq'] }] }
    ] },
    { title: 'Example 1', cues: [
      { say: "Now let's solve our equation. x squared, plus six x, minus two, equals zero.", ops: [{ clear: 'Example 1' }, { panel: null }, { write: 'a1', tex: 'x^2 + 6x - 2 = 0' }] },
      { say: "Step one. Move the constant term to the right hand side. Add two to both sides.", ops: [{ write: 'a2', tex: `x^2 + ${B('6')}x = 2`, note: '+2 to both sides' }] },
      { say: "Step two. Take half the coefficient of x. Half of six is three. Then square it. Three squared is nine.", ops: [{ write: 'a3', tex: `\\left(\\tfrac{${B('6')}}{2}\\right)^2 = ${H('3')}^2 = ${S('9')}`, note: 'half, then square' }, { hl: ['b', 'h', 'sq'] }] },
      { say: "Step three. Add nine to both sides. This is important. Whatever you add to the left, you must also add to the right.", ops: [{ write: 'a4', tex: `x^2 + 6x + ${S('9')} = 2 + ${S('9')}`, note: '+9 to BOTH sides' }, { hl: ['sq'] }] },
      { say: "Step four. The left side is now a perfect square: x plus three, all squared. And two plus nine is eleven.", ops: [{ write: 'a5', tex: `(x + ${H('3')})^2 = 11` }, { hl: ['h'] }] },
      { say: "Step five. Take the square root of both sides. Don't forget plus or minus, because both a positive and a negative number square to give eleven.", ops: [{ write: 'a6', tex: 'x + 3 = \\pm\\sqrt{11}', note: 'never forget ±' }] },
      { say: "Step six. Subtract three from both sides. So x equals minus three, plus or minus root eleven.", ops: [{ write: 'a7', tex: 'x = -3 \\pm \\sqrt{11}' }, { box: 'a7' }] },
      { say: "That's the exact answer. As decimals, x is about zero point three two, or minus six point three two, to two decimal places.", ops: [{ write: 'a8', tex: 'x \\approx 0.32 \\quad\\text{or}\\quad x \\approx -6.32' }] },
      { say: "Always check your answer. Put zero point three one six six back into the equation. The left side comes out almost exactly zero. It works.", ops: [{ write: 'a9', tex: '(0.3166)^2 + 6(0.3166) - 2 \\approx 0 \\ \\checkmark' }] }
    ] },
    { title: 'Example 2: when a is not 1', cues: [
      { say: "What if the coefficient of x squared is not one? Let's solve two x squared, minus eight x, plus three, equals zero.", ops: [{ clear: 'Example 2: when the x² coefficient is not 1' }, { write: 'b1', tex: '2x^2 - 8x + 3 = 0' }] },
      { say: "First, divide every term by two, so that x squared stands alone.", ops: [{ write: 'b2', tex: 'x^2 - 4x + \\tfrac{3}{2} = 0', note: '÷2, every term' }] },
      { say: "Now the same steps as before. Move the constant. x squared, minus four x, equals minus three over two.", ops: [{ write: 'b3', tex: `x^2 ${B('- 4')}x = -\\tfrac{3}{2}` }] },
      { say: "Half of minus four is minus two. And minus two, squared, is plus four. The square is always positive.", ops: [{ write: 'b4', tex: `\\left(\\tfrac{${B('-4')}}{2}\\right)^2 = (${H('-2')})^2 = ${S('4')}`, note: 'keep the sign when halving' }, { hl: ['b', 'h', 'sq'] }] },
      { say: "Add four to both sides. Minus three over two, plus four, gives five over two.", ops: [{ write: 'b5', tex: `x^2 - 4x + ${S('4')} = -\\tfrac{3}{2} + ${S('4')} = \\tfrac{5}{2}` }] },
      { say: "The left side is x minus two, all squared. Notice that the minus sign comes from the half, which was minus two.", ops: [{ write: 'b6', tex: `(x ${H('- 2')})^2 = \\tfrac{5}{2}` }, { hl: ['h'] }] },
      { say: "Square root both sides, with plus or minus. Then add two.", ops: [{ write: 'b7', tex: 'x - 2 = \\pm\\sqrt{\\tfrac{5}{2}}' }, { write: 'b8', tex: 'x = 2 \\pm \\sqrt{\\tfrac{5}{2}}', at: 2.2 }, { box: 'b8' }] },
      { say: "So x is approximately three point five eight, or zero point four two.", ops: [{ write: 'b9', tex: 'x \\approx 3.58 \\quad\\text{or}\\quad x \\approx 0.42' }] }
    ] },
    { title: 'The turning point', cues: [
      { say: "Completing the square does more than solve equations. It also finds the turning point of a graph. Here is y equals x squared, plus six x, minus two.", ops: [{ clear: 'Bonus: the turning point' }, { panel: 'graph', s: { spec: CS, show: ['curve'] }, fresh: 1 }, { write: 't1', tex: 'y = x^2 + 6x - 2' }] },
      { say: "Complete the square. x squared plus six x is x plus three all squared, minus nine. So y equals x plus three, all squared, minus eleven.", ops: [{ write: 't2', tex: `y = (x + ${H('3')})^2 - ${S('9')} - 2` }, { write: 't3', tex: 'y = (x + 3)^2 - 11', at: 3.5 }, { box: 't3' }] },
      { say: "A square can never be negative. So the smallest value of x plus three, all squared, is zero. That happens when x is minus three.", ops: [{ write: 't4', tex: '(x + 3)^2 \\ge 0' }] },
      { say: "So the minimum value of y is minus eleven, and the turning point is at minus three, minus eleven.", ops: [{ panel: 'graph', s: { show: ['curve', 'vguide', 'vertex'] } }, { write: 't5', tex: '\\text{minimum point: } (-3,\\ -11)' }, { box: 't5' }] },
      { say: "And the curve crosses the x axis exactly at the two answers we found: minus three plus root eleven, and minus three minus root eleven.", ops: [{ panel: 'graph', s: { show: ['curve', 'vguide', 'vertex', 'roots'] } }] }
    ] },
    { title: 'Common mistakes', cues: [
      { say: "Now, the mistakes that cost students marks in WAEC and NECO.", ops: [{ clear: 'Common mistakes' }, { panel: null }] },
      { say: "One. Forgetting to divide by the coefficient of x squared before you start.", ops: [{ write: 'm1', tex: '\\text{1.\\ Not dividing by the } x^2 \\text{ coefficient first}' }] },
      { say: "Two. Adding the square to only one side. It must go on both sides.", ops: [{ write: 'm2', tex: '\\text{2.\\ Adding the square to one side only}' }] },
      { say: "Three. Forgetting the plus or minus when you take square roots. You will lose one of the two answers.", ops: [{ write: 'm3', tex: '\\text{3.\\ Forgetting } \\pm' }] },
      { say: "Four. Halving the wrong number. Halve the coefficient of x, and keep its sign. Never halve the constant term.", ops: [{ write: 'm4', tex: '\\text{4.\\ Halving the constant instead of the } x \\text{ coefficient}' }] }
    ] },
    { title: 'Where the quadratic formula comes from', cues: [
      { say: "Here's something powerful. Let's complete the square on the general equation: a x squared, plus b x, plus c, equals zero.", ops: [{ clear: 'Where the formula comes from' }, { write: 'q1', tex: 'ax^2 + bx + c = 0' }] },
      { say: "Divide every term by a, and move the constant to the right.", ops: [{ write: 'q2', tex: `x^2 + ${B('\\tfrac{b}{a}')}x = -\\tfrac{c}{a}` }] },
      { say: "Half of b over a is b over two a. Add its square to both sides.", ops: [{ write: 'q3', tex: `x^2 + \\tfrac{b}{a}x + ${S('\\left(\\tfrac{b}{2a}\\right)^2')} = ${S('\\left(\\tfrac{b}{2a}\\right)^2')} - \\tfrac{c}{a}` }, { hl: ['sq'] }] },
      { say: "The left side is a perfect square. The right side simplifies to b squared minus four a c, over four a squared.", ops: [{ write: 'q4', tex: `\\left(x + ${H('\\tfrac{b}{2a}')}\\right)^2 = \\dfrac{b^2 - 4ac}{4a^2}` }] },
      { say: "Square root both sides, plus or minus, then subtract b over two a.", ops: [{ write: 'q5', tex: 'x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' }, { box: 'q5' }] },
      { say: "That is the quadratic formula. It is simply completing the square, done once, for every quadratic equation.", ops: [] }
    ] },
    { title: 'Summary', cues: [
      { say: "Let's summarise the method. One. Make the coefficient of x squared equal to one.", ops: [{ clear: 'Summary: completing the square' }, { write: 's1', tex: '\\text{1.\\ Make the } x^2 \\text{ coefficient } 1' }] },
      { say: "Two. Move the constant term to the right hand side.", ops: [{ write: 's2', tex: '\\text{2.\\ Move the constant to the right}' }] },
      { say: "Three. Add the square of half the coefficient of x, to both sides.", ops: [{ write: 's3', tex: `\\text{3.\\ Add } \\left(\\tfrac{${B('b')}}{2}\\right)^2 \\text{ to both sides}` }] },
      { say: "Four. Write the left side as a perfect square.", ops: [{ write: 's4', tex: '\\text{4.\\ Write the left side as } (x + p)^2' }] },
      { say: "Five. Square root both sides, with plus or minus, and solve for x.", ops: [{ write: 's5', tex: '\\text{5.\\ Square root with } \\pm \\text{, then solve}' }] }
    ] },
    { title: 'Your turn', cues: [
      { say: "Now it's your turn. Solve x squared, minus ten x, plus seven, equals zero, by completing the square. Pause the video and try it.", hold: 12, ops: [{ clear: 'Your turn' }, { write: 'y1', tex: 'x^2 - 10x + 7 = 0' }] },
      { say: "Here's the solution. Move the constant. x squared minus ten x equals minus seven.", ops: [{ write: 'y2', tex: `x^2 ${B('- 10')}x = -7` }] },
      { say: "Half of minus ten is minus five. Minus five squared is twenty-five. Add twenty-five to both sides.", ops: [{ write: 'y3', tex: `x^2 - 10x + ${S('25')} = -7 + ${S('25')} = 18` }, { hl: ['b', 'sq'] }] },
      { say: "So x minus five, all squared, equals eighteen.", ops: [{ write: 'y4', tex: `(x ${H('- 5')})^2 = 18` }] },
      { say: "Square root both sides. Root eighteen simplifies to three root two.", ops: [{ write: 'y5', tex: 'x - 5 = \\pm\\sqrt{18} = \\pm 3\\sqrt{2}' }] },
      { say: "So x equals five, plus or minus three root two. Well done if you got it.", ops: [{ write: 'y6', tex: 'x = 5 \\pm 3\\sqrt{2}' }, { box: 'y6' }] },
      { say: "That's completing the square. Practise it until every step feels natural, and I'll see you in the next lesson.", ops: [] }
    ] }
  ]
};
