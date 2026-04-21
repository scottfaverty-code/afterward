import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DEMO_EMAIL = "eleanor.mitchell.demo@myafterword.co";
const DEMO_SLUG = "eleanor-mitchell";

const ANSWERS: { section_slug: string; question_id: string; answer_text: string }[] = [
  // Your Roots
  {
    section_slug: "your-roots",
    question_id: "roots-q1",
    answer_text: `I want you to know where I came from. I grew up in a small farmhouse in Vermont, where the winters were long but our kitchen was always warm. My mother would wake before dawn to start the woodstove, and by the time my sisters and I came downstairs, the whole house smelled of coffee and fresh bread. We didn't have much, but we never knew it. The fields behind our house stretched all the way to the tree line, and in summer we'd spend entire days out there, catching frogs in the creek and racing each other to the old oak.

That farmhouse shaped everything about how I think a home is supposed to feel. Not perfect. Not grand. Just warm, and full, and always open.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q2",
    answer_text: `My father's hands. He was a dairy farmer and his hands were always rough from the cold and the work, but when he held my hand walking across the yard to the barn in the dark before sunrise, I couldn't have been older than four, I felt entirely safe. The barn was warm and it smelled of hay and the cows, and he'd let me sit up on a stool and watch the morning milking. I don't think I understood then that I was watching my father do something hard and essential. I just knew it was peaceful, and that he let me be there with him.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q3",
    answer_text: `Busy and close. My father farmed; my mother kept everything running. There were five of us children, Ruth, me, Patsy, and the two boys, Charlie and Ed. We worked alongside our parents when there was work to be done, which was most of the time. Nobody talked about feelings much, but you always knew where you stood with people. If someone was sick, you sat with them. If someone needed help, you helped. That was just understood, and I've never lost that understanding.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q4",
    answer_text: `My mother, Lillian, first and always. She was the kind of woman who could make a meal out of almost nothing and make everyone at the table feel like they'd been given a feast. She didn't complain. She worked, she sang while she worked, and she noticed things about people that nobody else noticed. I learned from her that taking care of someone is a skill, maybe the most important skill there is, and that it deserves to be taken seriously.

My sisters Ruth and Patsy were my first friends and my longest ones. We shared a room our whole childhood, sometimes a bed in the coldest months, and we knew each other in the way only people who have grown up under the same roof can know each other. And there was my third-grade teacher, Miss Aldrich, who told my mother I had a gift for listening. I don't know if that was exactly a gift, but I've tried to make it one.`,
  },

  // The Life You Built
  {
    section_slug: "the-life-you-built",
    question_id: "built-q1",
    answer_text: `I raised four children, Susan, Paul, Maggie, and Anne, and I was a wife to Thomas for forty-three years, and I was what people in our town called a neighbor, which meant something specific there: you showed up. You brought food when there was illness. You organized the harvest supper. You drove the older women to their appointments when they couldn't drive themselves. I helped run the quilting circle at the church for almost thirty years, and I volunteered with Meals on Wheels until my knees wouldn't cooperate anymore.

People sometimes used to ask me if I wished I'd had a career, and my honest answer was always no. Not because careers aren't worth having, I watched my daughters build theirs and felt nothing but pride. But because the work I did felt necessary in a way I understood. Someone had to hold the center. I was glad to be the one who did it.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q2",
    answer_text: `I said yes when Thomas asked me to marry him, and I was only twenty-two and hadn't seen much of the world yet. My mother thought I might be rushing. I wasn't. He was the steadiest, kindest man I'd ever met, and I knew it.

The other risk I'm glad I took was smaller but felt large at the time: in 1987, I stood up at a town meeting and argued against a proposal that would have changed the character of our community in ways I thought we'd regret. I'd never spoken publicly before. My voice shook the whole time. But I made my case, and people listened, and the measure failed. Afterward, an old farmer named Mr. Harrington shook my hand and said, "You were right, and you had the nerve to say so." That meant more to me than he knew.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q3",
    answer_text: `Thomas had a stroke in the winter of 2008. He was sixty-three. He survived it, but he was never quite the same man afterward, the words came slower, the hand that had spent forty years building things in his workshop couldn't do the work it used to do. We had two years together after that, and they were hard years, but they were also years I wouldn't trade. I learned things about love in those two years that I hadn't known in the forty that came before. He died in March of 2010, on a Tuesday morning, with all four of the children in the house.

I got through it the way you get through anything: one day at a time, and with help. The church helped. Ruth helped. Susan and Maggie drove up from Connecticut every other weekend for months. And I kept cooking, I don't know why, but keeping the kitchen going felt like holding on to something true. The house still smelled like a home. That mattered.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q4",
    answer_text: `The summer all four children were still at home, I think it was around 1979, Susan was fifteen, Paul twelve, Maggie nine, Anne six. Thomas was building a back porch for us, and the children would come out after supper to watch his progress and hand him tools and mostly get in the way, and he would explain what he was doing to each of them with such patience. I'd sit on the steps with my coffee and watch them all in the long summer light, and I'd think: this is it. This is the thing I'll look back on.

I was right.`,
  },

  // The People Who Matter
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q1",
    answer_text: `Thomas shaped me most. Not by telling me what to think or who to be, he wasn't that kind of person, but by being so consistently himself that I felt free to be consistently myself. He didn't need me to be anything other than what I was. In fifty years of knowing him I never once felt like I was performing. That's a rare gift to give someone. I hope I gave it back.

My mother shaped who I knew how to be in a house. Thomas shaped who I was allowed to be in the world.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q2",
    answer_text: `Miss Aldrich, my third-grade teacher in Barnard. She wrote something in my report card once, I still have it, somewhere in the cedar chest, something about how I had a gift for making other children feel at ease. I was eight years old. I hadn't thought of myself as someone who had gifts. I've thought about that ever since. I never went back to tell her what that meant.

I've thought often about the small sentences that change a child's idea of herself. I hope I said a few of those to my own children without knowing it.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q3",
    answer_text: `Thomas shaped me most. Not by telling me what to think or who to be, he wasn't that kind of person, but by being so consistently himself that I felt free to be consistently myself. He didn't need me to be anything other than what I was. In fifty years of knowing him I never once felt like I was performing. That's a rare gift to give someone. I hope I gave it back.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q4",
    answer_text: `Susan, Paul, Maggie, Anne. And the nine grandchildren, each one a kind of miracle I didn't expect to feel so strongly about until they arrived. What I want them to know is something I've already written down and mean every word of: you were my greatest adventure and my deepest joy. The adventure of watching you become yourselves, year by year, that was the thing I lived for.

I also want them to know that their father would be so proud. He loved them in a quieter way than I did, he showed it through what he built, through what he fixed, through the way he always had time when they needed him. I've tried to keep saying his name so he doesn't become a memory too soon.`,
  },

  // What You Believe
  {
    section_slug: "what-you-believe",
    question_id: "believe-q1",
    answer_text: `That you don't have to earn rest. I spent years feeling vaguely guilty for sitting still, for reading in the afternoon, for not always being productive. I thought worthiness had to be worked for every day. It doesn't. You are allowed to simply exist sometimes. You are allowed to sit in the garden and watch the bees and do nothing of practical use. I didn't fully believe that until I was in my sixties, and I wish I'd had those earlier years back.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q2",
    answer_text: `That most people are lonely in some way they haven't said out loud, and that being genuinely seen by another person is one of the things human beings need most. I've watched this for eighty years. The people who are difficult are almost always the ones who feel unseen, the ones who soften when you give them a little time and attention. I try to give it whenever I can.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q3",
    answer_text: `Pay attention. To the people in front of you, to the season you're in, to what a day actually holds. Most of life is not the big moments, it's the ordinary ones, and whether you were awake to them. Feed people. Say what you mean. Don't save the good dishes for company that never comes. Be easier on yourself than your mother probably was on herself.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q4",
    answer_text: `What matters: being present with the people you love. Having a warm place where people feel welcome. Keeping your word. Knowing your neighbors. Growing something, a garden, a child, a friendship.

What doesn't matter: what your house looks like compared to someone else's. Whether you were always right. What people who didn't know you well thought of you. Most of the things I wasted worry on turn out to have belonged in this category.`,
  },

  // Your Proudest Moments
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q1",
    answer_text: `The harvest supper. For twenty-eight years I organized the harvest supper at our church, and every year we fed the whole town and raised money for families who were struggling, and for one evening everyone sat down together, the old families and the new ones, the people who agreed about nothing, and ate. I'm proud of that. I'm proud that it happened every year because enough people believed it mattered, and because I kept believing it mattered even in the years when it felt like a lot of work for one night.

And I'm proud of my children. Not of their accomplishments, though those are real, but of who they are to each other. They still call each other. They still show up. That's the thing Thomas and I were most trying to build, and it held.`,
  },
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q2",
    answer_text: `In 1987, I stood up at a town meeting and argued against a proposal that would have changed the character of our community. I'd never spoken publicly before. My voice shook the whole time. But I made my case, and people listened, and the measure failed. Afterward, an old farmer named Mr. Harrington shook my hand and said, "You were right, and you had the nerve to say so." That surprised me, I hadn't thought of myself as someone with nerve. I've tried to live up to it since.`,
  },
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q3",
    answer_text: `The harvest supper, and what it represented. For twenty-eight years, one evening each fall, the whole town came together. The supper outlasted disagreements, hard winters, changes in the community. I didn't build it alone, but I kept it going, and I'm glad I did. You don't need your name attached to something for it to be yours. You just need to have cared for it long enough that it became part of you.`,
  },

  // A Letter to Your Family
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q1",
    answer_text: `You were my greatest adventure and my deepest joy. Carry our memories forward, but don't live in them. I want you to make new ones, ones that are entirely your own. And when you miss me, come here, to the table, to the kitchen, to the place where we always gathered. I'll be right where I always was: in the middle of the people I love most.

Susan, you are the one who taught me that strength doesn't have to announce itself. Paul, you have your father's hands and his patience, and that has always made me glad. Maggie, you are more like me than you probably want to know, and that has always made me proud. Anne, you were the last one home and you filled the house with something the rest of us hadn't known it was missing.`,
  },
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q2",
    answer_text: `The belief that a table is more than furniture. That gathering people around it, for no reason, for every reason, is one of the most important things a person can do. Carry that forward. Keep the table full.

And carry forward the knowledge that ordinary things, done with love and consistency, add up to something. A life doesn't have to be dramatic to be meaningful. Most of the best ones aren't.`,
  },
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q3",
    answer_text: `I felt, most of the time, exactly where I was supposed to be. That's not a small thing. Lots of people spend their whole lives looking for that feeling and never find it. I found it early, in this state, in this town, in this family, and I held on to it, and it held on to me. I was happy. More often than not, and more deeply than I probably ever said out loud, I was happy.`,
  },

  // How You Want to Be Remembered
  {
    section_slug: "how-you-want-to-be-remembered",
    question_id: "remember-q1",
    answer_text: `As someone who kept a warm house. As a woman who showed up. As someone who made you feel, when you sat at her table, that you were exactly the person she'd been hoping to see.`,
  },
  {
    section_slug: "how-you-want-to-be-remembered",
    question_id: "remember-q2",
    answer_text: `The thing I most want you to know is the way you feel when you come in from the cold, that particular feeling, the warmth and the welcome, the smell of something in the oven, the light on in the window. If that's what they feel when they think of me, then I did what I set out to do.`,
  },
];

export async function POST() {
  const { isAdmin } = await import("@/lib/admin-auth");
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";

  await admin.from("profiles").upsert({
    id: userId,
    first_name: "Eleanor",
    last_name: "Mitchell",
    avatar_url: `${appUrl}/images/eleanor-mitchell.png`,
    memorial_slug: DEMO_SLUG,
    page_is_public: true,
    has_seen_dashboard: true,
  }, { onConflict: "id" });

  await admin.from("story_answers").delete().eq("user_id", userId);

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
