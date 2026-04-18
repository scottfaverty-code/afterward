import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// One-time route to seed the Patrick William demo memorial.
// Protected: only scott.faverty@gmail.com can trigger it.
// Hit POST /api/admin/seed-demo to run.

const DEMO_EMAIL = "patrick.william.demo@myafterword.co";
const DEMO_SLUG = "patrick-william";

const ANSWERS: { section_slug: string; question_id: string; answer_text: string }[] = [
  // Your Roots
  {
    section_slug: "your-roots",
    question_id: "roots-q1",
    answer_text: `I grew up in Lowell, Indiana — a small town tucked in the northwestern corner of the state, close enough to Chicago that on a clear night you could see a faint glow on the horizon, but far enough away that we lived in our own quiet world. What I remember most is the space of it — the open fields, the way corn rows stretched to the horizon in summer, the particular smell of a grain elevator on a hot August day. My father worked at one of those elevators most of my boyhood, and when I'd walk by I could always find him by that smell.

Lowell wasn't a place that asked much of you, and maybe that was part of its charm. Friday nights in the fall meant high school football. Summers meant the lake and fireflies. People knew each other not just by name but by family — whose son you were, whose grandchild. I didn't fully appreciate what that meant until I left.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q2",
    answer_text: `I must have been three or four. It was winter, and my mother was ironing in the kitchen with the radio on — some big band music, I think. I remember the hiss of steam and the way the kitchen windows had fogged over completely. I'd drawn something in the condensation with my finger — probably just scribbles — and she came and looked at it and said, "Oh Patrick, you made a masterpiece." I didn't know what that word meant, but I knew from her tone it was something good.

I've thought about that moment more than makes any logical sense. I think it was the first time I understood that someone could make something out of nothing and have it matter to another person.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q3",
    answer_text: `We were modest by every measure — money, ambition, footprint in the world. My parents, my younger sister Diane, and me in a two-bedroom house on Elm Street. My father worked; my mother kept the house and raised us and made sure we said grace and did our homework. We weren't a family that talked much about feelings, but we were a family that showed up. Supper at the table every night. Church on Sundays. Road trips to visit my grandparents in the summer.

It was the kind of family that was easy to take for granted when you were young and that you'd give almost anything to have back once you're older. I was lucky in ways I only understand now.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q4",
    answer_text: `My mother, without question. Dorothy William was a schoolteacher before she married my father, and even after she stopped teaching in a classroom, she never stopped teaching at home. She read to me every night until I was old enough to be embarrassed about it — and then I pretended to be embarrassed but was secretly glad she kept going. She had a deep, unshakeable belief that education was the thing that made a life larger, and I absorbed that belief so completely that by the time I was a teenager I couldn't have told you where her conviction ended and mine began.

My father, Robert, was a quieter influence but a steady one. He worked hard, came home tired, never complained. He had a kind of dignity about ordinary work that I've tried to carry with me. And there was my fourth-grade teacher, Mrs. Hartman, who kept me after school one day not because I was in trouble but because she'd noticed I liked to read and wanted to give me a stack of books she thought I'd love. That gesture changed things for me. I didn't forget it. I don't think I ever will.`,
  },

  // The Life You Built
  {
    section_slug: "the-life-you-built",
    question_id: "built-q1",
    answer_text: `I spent my entire career in education — forty years of it, give or take. I started as a seventh-grade English teacher in Chula Vista, just south of San Diego, right after finishing at San Diego State. Then came middle school and high school positions, eventually a principalship in the Scottsdale district after Carol and I decided to put down roots in Arizona. And then, later than I'd expected and after more committee meetings than any person should endure, superintendent of a mid-sized district in the East Valley.

People ask which role I loved most, and the honest answer is teaching. There's nothing quite like watching a kid who thinks he's bad at something discover that he isn't — that he just hadn't been taught the right way yet. That moment of realization on a student's face is, I'd argue, one of the finest things a human being gets to witness. The principal and superintendent roles mattered, but they were about creating the conditions for other people to have those moments. Important work, but one step removed from the thing that made me want to do it in the first place.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q2",
    answer_text: `Leaving Indiana was the first one. I was seventeen and headed to Scottsdale with my family and it felt enormous at the time. The second was choosing teaching as a career. In 1971, my father gently pointed out that teachers didn't make much money, as if this were information I might not have come across. He wasn't wrong, but I'd decided the thing I wanted most was to do work that felt like it mattered. I've never once wished I'd chosen differently.

The third risk was asking Carol to marry me after knowing her for nine months. We were twenty-three years old. Everyone said we were rushing. We were, a little, but I knew. Some things you just know.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q3",
    answer_text: `Losing Carol. She was diagnosed with breast cancer in 2001, and after two years of fighting with more grace than I'll ever be able to adequately describe, she died in the spring of 2003. She was fifty-three years old.

I don't have a clean answer for how I got through it. I went to work because work was familiar and familiar felt like solid ground. I leaned on Michael and Karen and David more than I probably should have — they had their own grief and I sometimes forgot that. I walked a great deal, which sounds trivial but wasn't. And I had friends and colleagues who showed up in all the small ways that turn out to be the large ways. One of my assistant principals brought dinner to the house every Friday for a year. She never made a fuss about it. Just left it at the door. I've never forgotten that.

What I didn't do was pretend I was fine when I wasn't. I think that was the right choice. Grief is not a problem to be solved. It's a passage to be moved through.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q4",
    answer_text: `The years when our children were young — Michael in grade school, Karen just starting to walk and talk, David a baby. We were in a small house in Chula Vista, Carol was teaching part-time, money was tight, the future was entirely unwritten. I remember bath time and bedtime stories and Sunday morning pancakes and a kind of chaos that felt, even in the middle of it, like something precious.

I've come to believe that's one of the gifts of age — you can recognize the golden periods while you're in them, even if you don't always slow down enough to feel them fully. I didn't slow down enough. I wish I had. But I knew, even then, that I was happy. And knowing that may be the best a person can do.`,
  },

  // The People Who Matter
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q1",
    answer_text: `Carol loved me most, and the way she showed it was through her full attention. She remembered things — small things I'd mentioned in passing, concerns I'd voiced weeks before, details about the people in my life that I'd only described once. She held the whole of me in her mind in a way that made me feel, always, that I was seen. Not managed. Not accommodated. Seen.

After Carol, my three children — Michael, Karen, and David. Each of them has shown their love differently, which is right, because each of them is different. But the constancy of it, the way it's simply always been there regardless of distance or time — that's the thing I notice most now. That kind of love is not nothing. It is, in fact, everything.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q2",
    answer_text: `There was a man named Gerald Oakes who was my cooperating teacher when I was student teaching in 1970. He'd been in the classroom for over twenty years and had every reason to be burned out, but he wasn't. He watched me teach my first full lesson — I was terrible, I was nervous, I rushed through everything — and afterward he sat with me for an hour and went through every moment of it. Not harshly. Methodically. Lovingly, even. He treated my development as something worth investing in.

I never went back to thank him properly. He retired not long after and I lost track of him. I've thought about that for fifty years. If I could say one thing to him now it would be this: you changed the direction of my life that afternoon, and I spent forty years trying to do for other young teachers what you did for me.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q3",
    answer_text: `Carol shaped me more than anyone else. She was smarter than me in the ways that matter most — emotionally intelligent, perceptive about people, slow to judge and quick to forgive. She taught me to listen. I was a talker when I was young, always ready with a response before the other person had finished speaking. She would put her hand on my arm when I did it. Never said a word. Just that touch. It took me years to fully break the habit, but I did eventually break it, and I'm a better person for it.

My mother shaped who I became professionally. Mrs. Hartman shaped why. And the students I taught over the years — every difficult one, every struggling one, every one who made me work harder to reach them — shaped how I think about human potential.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q4",
    answer_text: `Michael, Karen, David — I have spent my whole life proud of who you are. Not what you've accomplished, though you've accomplished more than you know. Who you are. The kindness you show your own children. The integrity you bring to your work. The way you still call each other, still show up for each other, still take care of things the way your mother would have wanted. She would be overwhelmed with love for you. I am overwhelmed with love for you.

You were never background in my life. You were the whole point of it. Every career decision I made, every late night I worked, every year I poured into other people's children — it was all undergirded by the knowledge that I was coming home to you. Whatever I managed to build out there in the world, it was nothing compared to what we built together.`,
  },

  // What You Believe
  {
    section_slug: "what-you-believe",
    question_id: "believe-q1",
    answer_text: `That urgency is mostly an illusion. At twenty-five I was always in a hurry — hurrying toward the next job, the next milestone, the next version of the life I thought I was supposed to be building. I rarely sat still long enough to notice what I already had.

I'd tell the twenty-five-year-old version of myself: slow down. The life is in the ordinary days, not the extraordinary ones. Pay attention to ordinary Tuesdays. That's where most of your life actually happens.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q2",
    answer_text: `That almost everyone is doing their best with what they have, even when their best looks like failure or stubbornness or cruelty from the outside. I spent forty years working with children, and what strikes me most is how much of who a child becomes is determined by things they had no say in — the family they were born into, the neighborhood they grew up in, the teachers they happened to get.

I have enormous compassion for people because of that. Every difficult person I've met had a story that would make their difficulty make sense. I stopped expecting people to be different from what their circumstances made them, and started trying to understand the circumstances instead. That shift changed everything about how I did my job.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q3",
    answer_text: `Do work that means something to you. Love people with your full attention. Be honest without being unkind. Forgive more readily than feels comfortable. Spend time outside. Read books. Keep your word. Show up for people when things are hard, not just when things are easy.

And understand that none of this is achievable all the time — the goal is direction, not perfection. A life aimed at these things, even imperfectly, is a life well aimed.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q4",
    answer_text: `Teaching, in its broadest sense. Not the job — the act. The deliberate passing of something of value from one person to another. It could be knowledge, or a skill, or a way of seeing the world, or simply the belief that someone is worth believing in.

I've watched that act ripple outward in ways I couldn't have predicted. Teachers I hired who became remarkable. Students who went on to teach others. My own children, who teach their children things they learned, somewhere down the line, from someone I knew. That kind of continuity — the sense that what you do reaches forward in time — is the greatest source of meaning I've found.`,
  },

  // Your Proudest Moments
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q1",
    answer_text: `I'm proud of the teachers I hired over the years who went on to be exceptional. I had a hand in building something that outlasted me — classrooms full of good teaching, rippling forward into students I'll never meet. That feels like the right kind of legacy.

I'm proud of how my children turned out. That's not entirely my doing — it was Carol's work as much as mine, and their own as well — but I was part of it, and I'm proud.

And I'm quietly proud that when Carol was sick, I didn't run from it. I was there for every appointment, every hard conversation, every night she couldn't sleep. I did what I was supposed to do as a husband. In the hardest season, I showed up.`,
  },
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q2",
    answer_text: `The year after Carol died, I went back to work as superintendent of a district dealing with a significant budget crisis. I was running on fumes emotionally, making decisions that affected hundreds of teachers and thousands of students, and trying not to let anyone see how diminished I felt. I don't know if I fully succeeded. But I made the decisions, I showed up to every meeting, I didn't make things worse in my grief.

That year was the hardest professional stretch of my life, and very few people knew what it cost me to get through it. I surprised myself by getting through it at all.`,
  },
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q3",
    answer_text: `I'd like to think there are students — now in their forties and fifties — who occasionally remember a teacher or a principal or a school system that treated them like they were worth believing in. That's all. I don't need to be named in those conversations. I just hope those experiences happened, that they stuck, that they made someone's life a little larger than it might have been otherwise.

That's the thing I built. It doesn't have a shape you can photograph or a value you can assess. But I believe it's real, and believing that is enough.`,
  },

  // A Letter to Your Family
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q1",
    answer_text: `Michael, Karen, David —

I have spent my whole life proud of who you are. Not what you've accomplished, though you've accomplished more than you know. Who you are. The kindness you show your own children. The integrity you bring to your work. The way you still call each other, still show up for each other, still take care of things the way your mother would have wanted.

She would be overwhelmed with love for you. I am overwhelmed with love for you.

To my grandchildren: your grandfather was a little overwhelmed by you from the very beginning, in the best way. You were all so specific, so yourselves, from the very first moment. Watch out for each other. Read books. Ask questions. Don't be in too much of a hurry.`,
  },
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q2",
    answer_text: `The belief that teaching — in its broadest sense, the deliberate passing of something of value from one person to another — is among the most important things a human being can do. You don't have to be a teacher by profession to do this. You can teach with the way you live, with the questions you ask, with the patience you show. Carry that forward.

And carry forward the conviction that ordinary life, done with care, is enough. More than enough. The world will tell you otherwise. Don't believe it.`,
  },
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q3",
    answer_text: `I felt lucky. Despite losing Carol when I didn't want to lose her, despite the hard years and the mistakes and the long stretches of ordinary days that blurred together — lucky. I got to do work I believed in. I got to raise three people I admire. I got to be loved by someone worth being loved by. I got to watch seven small people come into the world and become themselves.

If that isn't a full life, I don't know what is. I want you to know that I knew it was full, even when it was hard. I want you to know I was grateful.`,
  },

  // How You Want to Be Remembered
  {
    section_slug: "how-you-want-to-be-remembered",
    question_id: "remember-q1",
    answer_text: `As someone who took other people's children as seriously as his own. As a husband who loved well. As a father who was present. As a man who meant what he said.

I'd like them to understand that I believed, genuinely and without reservation, that every person is worth believing in. That I tried to act on that belief every day, in every classroom and every meeting and every conversation that mattered. And that the belief never left me, not even in the hard years, not even at the end.`,
  },
  {
    section_slug: "how-you-want-to-be-remembered",
    question_id: "remember-q2",
    answer_text: `The thing I most want you to know is that a quiet, ordinary life — one without fame or fortune or a name anyone outside your community would recognize — can be a life that mattered enormously. That you don't need to be extraordinary to leave something real behind. You just need to show up, pay attention, and love the people in front of you.

That's the whole thing, as best as I can figure. That was always the whole thing.`,
  },
];

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== "scott.faverty@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Create or retrieve demo user
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  let demoUser = existingUsers?.users?.find((u) => u.email === DEMO_EMAIL);

  if (!demoUser) {
    const { data: created } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      email_confirm: true,
    });
    demoUser = created?.user ?? undefined;
  }

  if (!demoUser) {
    return NextResponse.json({ error: "Could not create demo user" }, { status: 500 });
  }

  const userId = demoUser.id;

  // Upsert profile
  await admin.from("profiles").upsert({
    id: userId,
    first_name: "Patrick",
    last_name: "William",
    memorial_slug: DEMO_SLUG,
    page_is_public: true,
    has_seen_dashboard: true,
  }, { onConflict: "id" });

  // Delete existing answers so we can re-seed cleanly
  await admin.from("story_answers").delete().eq("user_id", userId);

  // Insert all answers
  const rows = ANSWERS.map((a) => ({
    user_id: userId,
    section_slug: a.section_slug,
    question_id: a.question_id,
    answer_text: a.answer_text,
    skipped: false,
  }));

  const { error } = await admin.from("story_answers").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug: DEMO_SLUG, userId });
}
