import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Seeds Patrick William Faverty's personal memorial page.
// Protected: only scott.faverty@gmail.com can trigger it.
// Hit POST /api/admin/seed-patrick-faverty to run.

const MEMORIAL_EMAIL = "patrick.faverty.memorial@myafterword.co";
const MEMORIAL_SLUG = "patrick-faverty";

const ANSWERS: { section_slug: string; question_id: string; answer_text: string }[] = [
  // Your Roots
  {
    section_slug: "your-roots",
    question_id: "roots-q1",
    answer_text: `I grew up in several places, my dad's career moved us around quite a bit, but the place I feel most rooted in is the house my parents built in 1951 on U.S. Highway 41, several miles northwest of Lowell, Indiana. We had two and a half acres with a big garden, a chicken and duck and rabbit coop, a sandbox made from an old tractor tire. I know those trees we planted out front are still standing because I looked them up on Google Maps in 2017, and there they were. That made me inexplicably happy.

What I remember most is the space of it, ten more acres of field behind us to run around in, the smell of vegetables you could eat right out of the ground (you spit the dirt out first, then bit in), the way my dad would cut the chickens' heads off in the afternoon and how hilarious my brother Fred and I found it watching them run around. If you've ever heard someone described as "running around like a chicken with its head cut off" that is a real thing. I have firsthand experience.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q2",
    answer_text: `My earliest clear memory is being at my Grandpa Bailey's farm. He raised registered Hereford cattle on about 160 acres, and I'd go with him at 6:00 in the morning to help milk the cows and gather eggs from the chicken house up in the second story of the big barn. There was a mulberry tree in the front yard. I remember climbing up into it and sitting on a branch eating mulberries until I was completely full.

When I went back for my grandparents' 50th wedding anniversary, I was 17 by then, the tree seemed impossibly small. I obviously was quite small myself when I did that.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q4",
    answer_text: `My Grandpa Bailey was enormous to me. He was the Secretary-Manager of the Indiana State Fair, which meant he essentially ran the whole operation, and in the summers I'd spend weeks with my grandparents at the fairgrounds, going behind the scenes in all the buildings. The most extraordinary thing I ever got to do as a child was go into the barn where the circus elephants slept. The handlers let me pet them. They used their trunks to smell and touch me, and even though I was only 8 or 9 and they were unimaginably large, they were quiet and slow and utterly gentle. I've never forgotten it.

My other grandfather, Marion Faverty Sr., was possibly the smartest man I ever knew. He'd just retired from being a Railroad Superintendent in the Chicago Stockyards. He would challenge me to multiply a four-digit number by another four-digit number in my head. He did it easily. I never once beat him, even using a pencil, and I still can't do it today.

And my brother Fred. We drove each other crazy from the sandbox on, but Fred was my first companion and one of the constants of my life for a long time. I miss him.`,
  },
  {
    section_slug: "your-roots",
    question_id: "roots-q3",
    answer_text: `Complicated, which I think is true of most families if you're honest about it. The Lowell years were probably our best. My dad was a welder, smart and hardworking, and my mom was sharp and capable. But when my dad hurt his back badly enough that he could never go back to welding, things shifted. We moved from Lowell to Hammond, then to Tucson when my little sister Ellen was born with asthma and the doctors said we had to get to a drier climate. Then Phoenix, then the San Diego area. I went to nine schools in eleven years.

What that does to a kid is make you very good at making friends quickly and very bad at keeping them. By high school I had learned how to connect with people fast, but I never fully trusted that any of it would last. My dad's drinking also got worse as I got older. By the time I was in high school he'd drink every night, and weekends were the worst, it put the entire family on edge. I dealt with that the way I dealt with everything uncomfortable: I went to my room and read, or I played tennis. Those two habits probably saved me, even if they also became ways of avoiding things that needed to be faced.`,
  },

  // The Life You Built
  {
    section_slug: "the-life-you-built",
    question_id: "built-q1",
    answer_text: `I spent my entire professional life in education, though it took some detours to figure out exactly where in education I belonged. I started as a teacher in Ibapah, Utah, an isolated community on the Utah-Nevada border, 180 miles west of Salt Lake City, with 11 students total and a school that ran on its own generator because we were that far from anywhere. Suzanne taught grades 1 through 3; I taught 4 through 6. We lived in a mobile home the county provided, rode borrowed horses out into the prairie and saw herds of antelope and deer, and drove 180 miles to Salt Lake City twice a month for groceries. It was absolute isolation, and it was one of the great adventures of my life.

From there: private schools, principalships, superintendencies, university work. The role I'm most proud of professionally is the Rio School District in Oxnard. When I arrived the district was a financial and organizational disaster. 85% of students were poor, 70% were second-language learners. We cleaned things up, built a real professional development culture, added technology, built new schools, and produced the greatest academic growth of any Ventura County school district two years running. Parents were happy, teachers were happy, students were happy. And then the politics ended it anyway.

My philosophy never changed from beginning to end: listening isn't learning, and telling isn't teaching. Schools still look almost exactly the way they did 100 years ago. I spent forty years trying to change that. I'm not sure how much I moved the needle. But I tried.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q3",
    answer_text: `The Carmel years. I was 28 when I left a fantastic position as the youngest private school headmaster in California to go start a new school in Carmel. Within a month, the funding collapsed. In one year I went from being a headmaster with a house, a car, and a future to essentially broke, with two small kids and no clear path forward. I dealt with that the way my dad had dealt with his worst frustrations: I drank too much and started using cocaine. I became someone I didn't recognize and didn't like. My wife had every reason to ask me to leave, and eventually she did.

The kick in the head, as I called it, was what I needed. I stopped using. I cut back on the drinking. I lived in a friend's basement for a while, still doing janitorial work at the preschool to bring in some money. I figured out that I needed to go back to school, get a real credential, and build a professional life I could actually be proud of. I went to UCSB for a master's in counseling psychology, earned my doctorate from the University of La Verne, and built the second chapter of my career from scratch. I'm grateful I had to do it. It made me considerably more self-aware and a better educator, and eventually a better person.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q2",
    answer_text: `Ibapah. Nobody took that job thinking it was a smart career move. But it was one of the most meaningful and interesting things I ever did. We had two Native American children, Sam and Helen Steele, live with us for a couple of months while their mother was in the hospital. The Governor of Utah invited us all to Salt Lake City for a lunch in support of the Goshute Indians. I sat next to Sam at the table with the Governor. When the Governor asked Sam what his family did for fun, Sam said, "We have a baby eagle." The Governor said, "Isn't that against the law?" And Sam said, "Them's white man's laws." That story has made me smile for fifty years.

I'm also glad I asked Cynthia to dinner on her birthday in 2016. She was working at Opolo Winery with me. I asked what she was doing for her 59th birthday. She said nothing. I said let me take you to dinner. She was hesitant, I pointed out she had nothing to lose, and she agreed. After dinner she gave me a kiss. I thought that went well. We got married two months later on the beach at San Simeon. That's the one I got right.`,
  },
  {
    section_slug: "the-life-you-built",
    question_id: "built-q4",
    answer_text: `Rancho Oso. The summer camp on the Santa Ynez River near Santa Barbara, the most beautiful valley I had ever seen. We were young and full of plans, and the ranch itself was extraordinary: 310 acres, horses, a lodge, the river running through it. It was a dream of a place to begin a family. It didn't work out the way we hoped, but the place was magic. For that alone I'd go back.

I'd also go back to January of 1994 at McDowell Elementary in Petaluma. I'd been away for a week at my doctoral residency. When I returned and walked into my office, it was completely full, floor to ceiling, with blue and white balloons in the school colors. The teachers came out of the lunch room and applauded and shook my hands and hugged me. That was the moment I knew I had found my place in leadership. It's the clearest memory I have of feeling exactly right for a job.`,
  },

  // The People Who Matter
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q1",
    answer_text: `Scott, Andra, and Shannon. And the grandchildren, Emerald and Berenger, Dean and Gavin and Crosby, Corbin and Arlo. What I want them to know is that my not being there the way I should have been during the Carmel years was my failure, not theirs. I was struggling with things I didn't understand about myself, and I handled it badly. That's on me. What you all became, regardless of any of that, fills me with more pride than anything else in my life. I love each of you without condition or qualification.

And Cynthia, who came into my life at 67 when I had stopped expecting to find the right person. She is an extraordinary artist and a patient, loving partner, and she makes every single day better. I don't take that lightly.

And Alice and Ellen. After losing Mom and Fred and Brian, you two are what home means to me.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q3",
    answer_text: `My Grandpa Bailey showed me what was possible, that someone from a modest Indiana background could lead something significant and do it with integrity. My Grandfather Faverty showed me what the mind could do when pushed.

But the person who shaped my adult thinking most was Dr. William Glasser, the psychologist I interned with at UCSB. His Reality Therapy framework, the idea that people can take ownership of the choices they make and the outcomes those choices produce, changed everything about how I worked with students. Instead of trying to control children's behavior, you help them understand the connection between their choices and their results. I used that for the rest of my career. It's also why I still believe so strongly that we have to change how we educate children. Not control them. Help them choose.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q2",
    answer_text: `Kirk Douglas. I spent three hours with him at Ojai Valley School when he was looking for a boarding school for his son. I was just the Director of Admissions, we couldn't take the boy, we didn't enroll seniors, but Kirk Douglas sat and talked with me for the entire afternoon anyway. He was one of the most remarkable people I ever encountered, and I never went back to tell him what that afternoon meant to me. He passed away in 2020 at 103.

And Sir Ken Robinson, who I got to spend time with at a Galef Institute workshop in Los Angeles. He had already become famous for his TED talk on how schools kill creativity. He was articulating things I had been trying to say for thirty years and saying them better than I ever had. He also passed away in 2020. I should have written to him.`,
  },
  {
    section_slug: "the-people-who-matter",
    question_id: "people-q4",
    answer_text: `I hope they say I was someone who genuinely tried, even when the trying came too late or looked like the wrong thing from the outside. I made real mistakes in relationships, I've written about them fairly honestly. But I hope the people who knew me could see that I was never trying to hurt anyone. I was mostly trying to figure out who I was and where I belonged. That took longer than it should have.

I hope the people I worked with over the years feel like I always put the kids first. The politics, the board fights, the ego trips, I got caught up in all of it at various points. But underneath, I always believed the work was about the children, and I hope that came through.`,
  },

  // What You Believe
  {
    section_slug: "what-you-believe",
    question_id: "believe-q1",
    answer_text: `That you can't outrun yourself. I spent most of my twenties and thirties moving, new school, new city, new job, and I told myself the moves were about opportunity, which was partly true. But they were also about my need to escape situations I had created or couldn't face. My whole childhood was about moving and leaving and starting over. I thought I had a talent for it. What I didn't understand was that I was carrying the same patterns with me everywhere I went. The geography changed; the behavior didn't.

I'd also tell my 25-year-old self: your relationship with your father is worth working on. Don't wait until he's retired and you're taking your own kids to visit him before you discover the man he could be. Those last ten years of his life, when we actually talked and actually knew each other, I'm grateful for them. I just wish there had been more.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q3",
    answer_text: `"Only those who will risk going too far can possibly find out how far one can go." That's T.S. Eliot, and it's probably the closest thing I have to a life philosophy. I've taken a lot of risks, some brilliant, some spectacularly dumb. But I've never been bored, and I've never played it safe in ways I've regretted. The things I regret are the risks I didn't take, the conversations I avoided, the relationships I let distance destroy.

I also believe the universe is a perfect place and it's all about energy. Every time a job ended or a situation collapsed, something else showed up. Not always immediately, not always conveniently, but something always showed up. I've tried to live by that, even when it was very hard to believe.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q2",
    answer_text: `That most people want to do the right thing and need someone to believe they can. I learned that in Ibapah, teaching kids nobody had expected much of. I learned it at McDowell and at Rio. The students who were hardest to reach were almost always the ones who most needed someone to look at them and say: I see you, I believe in you, and I'm not going anywhere. It doesn't always work. But it works more often than the alternative.

I also learned that school boards are frequently the biggest obstacle to good education. I've now said that in writing, so it's officially on the record.`,
  },
  {
    section_slug: "what-you-believe",
    question_id: "believe-q4",
    answer_text: `What matters: the specific children. Not children in the abstract, the actual ones. Sam Steele at lunch with the Governor of Utah. The students at Rio who outperformed every expectation. The doctoral students I helped guide through their dissertations. Each individual kid I can point to and say: I helped that person find something in themselves. That's what matters.

What doesn't: titles. I've been a teacher, a headmaster, a superintendent, a university director. None of those titles put anything lasting into the world. What lasts is what happened inside the classrooms and the schools, in the heads and hearts of the students. The title is just the address.`,
  },

  // Your Proudest Moments
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q1",
    answer_text: `The Rio School District. In four years, working with teachers and principals who were genuinely dedicated, we took a struggling district, 85% poverty, 70% second-language learners, financial mismanagement from top to bottom, and produced the greatest academic growth in Ventura County two years running. We built new schools from scratch. We gave every school wireless technology and laptops. And the whole community felt it: over 300 people showed up to school board meetings to support what we were building together. When it ended because of board politics, I was devastated. I loved Rio and they loved me. That matters, even when it doesn't last.

And the McDowell years in Petaluma. Four years of building something real with a group of teachers who trusted me and filled my office with balloons to prove it.`,
  },
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q2",
    answer_text: `Going back to school at 38 after the Carmel collapse. Living in a friend's garage. Doing janitorial work at a preschool while studying for my master's. Visiting my kids in Carmel on motel money and trying to make it feel normal when nothing about it was. Then doing the doctoral program while being a new principal, while going through a difficult second marriage, while trying to be present for Scott and Andra and Shannon in the ways I hadn't been.

Most people who knew me later, as a superintendent, as a university director with a nameplate on the door, had no idea that chapter existed. I'm not embarrassed by it anymore. I think it made me considerably better at working with people who are in hard places of their own.`,
  },
  {
    section_slug: "your-proudest-moments",
    question_id: "proud-q3",
    answer_text: `I hope someone is still using the project-based approach we developed at American Canyon Middle School in Napa. Every 8 to 12 weeks, students from five subject areas collaborated on a single project, wrote a five-page paper, gave a speech, presented to the group. No textbooks. Technology-integrated from the start. The students and teachers loved it. The school board shut it down after two years because the homework "looked different." That still makes me angry. But the model was right, and I hope it lived on in the teachers who built it with me.

I hope the grandchildren know I thought about them more than I showed. Emerald, Berenger, Dean, Gavin, Crosby, Corbin, Arlo, I am proud of all of you.`,
  },

  // A Letter to Your Family
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q1",
    answer_text: `Scott, Andra, Shannon: I know I wasn't the father I should have been during the hardest years of your childhoods. I've tried to say that over the years in different ways, but I'll say it clearly here: I'm sorry. You deserved more stability than I gave you. What I can tell you is that becoming your dad was the most important thing that ever happened to me, and watching you become the people you are has given me more pride than anything else in my life. I love you without condition or qualification.

To Cynthia: you found me when I had genuinely given up on finding anyone, and you have made this last chapter of the journey the best one. Thank you for saying yes on your birthday.

And to Alice and Ellen: I am incredibly lucky to have my two sisters. After losing Mom and Fred and Brian, you two are home.`,
  },
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q2",
    answer_text: `Take the risk. Go to the strange school in the middle of nowhere. Ask for the job nobody else wants. Ask the woman on her birthday if you can take her to dinner. "Only those who will risk going too far can possibly find out how far one can go." I've lived that, not always wisely, not always successfully, but I've lived it. I hope you do too.

And: "Unless someone like you cares a whole awful lot, nothing is going to get better. It's not." Dr. Seuss understood something most policy documents never do. Caring is the whole thing. Do your work like it matters. It does.`,
  },
  {
    section_slug: "a-letter-to-your-family",
    question_id: "letter-q3",
    answer_text: `I felt like I was supposed to be here, doing these things, in this imperfect, sprawling, constantly-moving way. The universe kept putting something new in front of me every time one thing ended, and I kept saying yes. Not always wisely. Not always bravely. But yes.

I ended up at the beach in San Simeon with Cynthia and a dog named Cooper and an art gallery in Cambria, and if you had shown me that picture when I was nine years old playing in the sandbox on Highway 41 outside Lowell, Indiana, I would not have believed it was possible. What a journey. What an absolutely improbable, wonderful journey.`,
  },

  // How You Want to Be Remembered
  {
    section_slug: "how-you-want-to-be-remembered",
    question_id: "remember-q1",
    answer_text: `As someone who believed in children when the system didn't, and did something about it. As someone who made real mistakes and owned them, at least eventually. As someone who, after a very long and very winding road, found his way to the right place.

And as a Hoosier. I was born in Indiana, I planted those trees on Highway 41, and no matter how far I went, Utah, California, Ojai, Carmel, Santa Barbara, Sacramento, Colombia, I am still a Hoosier. That's the base. That's where it started.`,
  },
  {
    section_slug: "how-you-want-to-be-remembered",
    question_id: "remember-q2",
    answer_text: `I hope they smile. "And in the end, it's not the years in your life that count. It's the life in your years." I tried to pack in a lot of life. The Ibapah reservation and lunch with the Governor of Utah. The elephant at the Indiana State Fair. The Porsche on the track at Laguna Seca. Three hours with Kirk Douglas. The balloons in the office at McDowell. The wine bar that got defrauded. Sitting in a hot tub in the San Bernardino mountains watching it snow until I couldn't see the stars anymore. Swimming in the Neptune Pool at Hearst Castle. The harvest at Denis's vineyard in Paso Robles. The wedding on the beach at San Simeon.

That is not a sad life. That is a full one.`,
  },
];

export async function POST() {
  const { isAdmin } = await import("@/lib/admin-auth");
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Create or retrieve memorial user
  const { data: existingUsers } = await admin.auth.admin.listUsers();
  let memorialUser = existingUsers?.users?.find((u) => u.email === MEMORIAL_EMAIL);

  if (!memorialUser) {
    const { data: created } = await admin.auth.admin.createUser({
      email: MEMORIAL_EMAIL,
      email_confirm: true,
    });
    memorialUser = created?.user ?? undefined;
  }

  if (!memorialUser) {
    return NextResponse.json({ error: "Could not create memorial user" }, { status: 500 });
  }

  const userId = memorialUser.id;

  // Upsert profile
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.myafterword.co";
  await admin.from("profiles").upsert({
    id: userId,
    first_name: "Patrick",
    last_name: "Faverty",
    avatar_url: `${appUrl}/images/patrick-faverty-2.png`,
    memorial_slug: MEMORIAL_SLUG,
    referred_as: "he",
    birth_year: 1949,
    death_year: 2025,
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

  return NextResponse.json({ ok: true, slug: MEMORIAL_SLUG, userId });
}
