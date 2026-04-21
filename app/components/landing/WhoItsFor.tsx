const cards = [
  {
    forLabel: "For yourself",
    title: "Set up your own Afterword while the window is open",
    body: "You\u2019ve lived a life worth knowing. You have stories your family hasn\u2019t heard, values you want to pass on, and things you want to say while you still can. Afterword gives you the space to say them permanently.",
    hook: "\u201cI want to be remembered the way I actually was, not the way someone else remembers me.\u201d",
  },
  {
    forLabel: "As a gift",
    title: "Give an aging parent the chance to tell their own story",
    body: "The most meaningful thing you can give someone isn\u2019t an object; it\u2019s the opportunity to be heard, permanently. Gift an Afterword page and set it up together. You\u2019ll both be glad you did.",
    hook: "\u201cI wanted to make sure I never had to say \u2018I wish I\u2019d asked more.\u2019\u201d",
  },
  {
    forLabel: "For a family who just lost someone",
    title: "Create a permanent memorial using the stories they left behind",
    body: "If someone you loved didn\u2019t set up their Afterword page before they passed, their family can still create one, using photos, stories, and memories to build the permanent tribute they deserved.",
    hook: "\u201cThere\u2019s still time to give them the memorial they deserved.\u201d",
  },
];

export default function WhoItsFor() {
  return (
    <section className="section-pad" style={{ backgroundColor: "#fff" }}>
      <div className="container-main">
        <div className="text-center mb-12">
          <h2
            className="font-serif mb-3"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#1B4F6B" }}
          >
            Who Afterword is for
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#666" }}>
            Three ways people use Afterword, each one addressing a different moment in the same journey.
          </p>
        </div>

        <div
          className="grid gap-6 cols-3"
        >
          {cards.map((card) => (
            <div
              key={card.forLabel}
              className="rounded-2xl p-7"
              style={{
                backgroundColor: "#fff",
                borderTop: "4px solid #1B4F6B",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="font-bold mb-2"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#C9932A",
                }}
              >
                {card.forLabel}
              </div>
              <div
                className="font-bold mb-3"
                style={{ fontSize: "1rem", color: "#1A1A1A" }}
              >
                {card.title}
              </div>
              <p className="mb-4" style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.7" }}>
                {card.body}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontStyle: "italic",
                  color: "#2E7DA3",
                  lineHeight: "1.6",
                }}
              >
                {card.hook}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
