import type { JournalArticle } from '@/types/journal';

export const MOCK_ARTICLES: JournalArticle[] = [
  {
    id: '1',
    slug: 'finding-light-in-small-moments',
    title: 'Finding Light in Small Moments',
    excerpt: 'When everything feels heavy, the smallest victories become our greatest teachers. Here\'s how to recognize and celebrate them.',
    body: `When everything feels heavy, the smallest victories become our greatest teachers. Here's how to recognize and celebrate them.

## The Weight of "Fine"

We've all said it: "I'm fine." But what does that really mean when you're holding yourself together with invisible threads? This week, I want to talk about something we don't discuss enough—the small moments that matter when big progress feels impossible.

## Small Doesn't Mean Insignificant

Getting out of bed. Drinking water. Texting a friend back. These aren't just tasks—they're acts of courage when you're struggling. Each one is a choice to keep going, and that's worth recognizing.

### What This Looks Like

- Making your bed (even if you get back in it later)
- Taking a shower when it feels like climbing a mountain
- Eating something, even if it's not "healthy"
- Opening the curtains to let light in
- Sending that "I'm thinking of you" text

## The Practice of Noticing

Start keeping track—not in a productivity way, but in a "I did this and it mattered" way. Write them down. Tell someone. Let yourself feel proud.

Because on the days when you can't do much, these moments prove you're still here. Still trying. Still worthy.

And that's everything.`,
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=600&fit=crop',
    author: {
      name: 'The Sunflower Team',
      avatar: '🌻',
      bio: 'Curating community wisdom and sharing stories of healing.',
    },
    category: 'Self-Care',
    tags: ['mindfulness', 'mental health', 'daily practices'],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readTimeMinutes: 4,
    featured: true,
    commentCount: 12,
    reactionCount: 48,
  },
  {
    id: '2',
    slug: 'when-healing-isnt-linear',
    title: 'When Healing Isn\'t Linear',
    excerpt: 'Progress isn\'t always forward. Sometimes it\'s sideways, backwards, or just standing still. And that\'s okay.',
    body: `Progress isn't always forward. Sometimes it's sideways, backwards, or just standing still. And that's okay.

## The Myth of the Mountain

We're taught that healing looks like climbing a mountain—steady progress, clear milestones, a summit in sight. But what if it's more like tending a garden?

Some days you plant seeds. Some days you water. Some days you just sit and watch what's already growing. And some days, you have to pull weeds that came from nowhere.

## What Actually Happens

Healing looks like:
- Having a great week, then a terrible day
- Learning the same lesson three different times
- Feeling fine, then suddenly not
- Taking steps forward, then needing to rest
- Celebrating progress, then questioning if you've made any

## The Permission Slip

You don't have to be "better" all the time. You don't have to prove you're healing. The bad days don't erase the good ones, and needing help again doesn't mean you failed.

### Remember This

Your worst day now might still be better than your worst day a year ago. That counts. Your ability to recognize when you need support—that's growth. The fact that you're still here, still trying—that's everything.

Healing isn't about never falling. It's about getting back up, even when it takes longer than you thought it would.`,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop',
    author: {
      name: 'The Sunflower Team',
      avatar: '🌻',
    },
    category: 'Mental Health',
    tags: ['healing', 'progress', 'self-compassion'],
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readTimeMinutes: 5,
    featured: true,
    commentCount: 24,
    reactionCount: 89,
  },
  {
    id: '3',
    slug: 'setting-boundaries-without-guilt',
    title: 'Setting Boundaries Without Guilt',
    excerpt: 'Saying no doesn\'t make you selfish. It makes you honest. Here\'s how to protect your peace without apologizing.',
    body: `Saying no doesn't make you selfish. It makes you honest. Here's how to protect your peace without apologizing.

## The Problem with "Yes"

How many times have you said yes when you meant no? Not because you wanted to, but because saying no felt too hard, too mean, too selfish?

Let's talk about why boundaries aren't betrayal—they're self-preservation.

## What Boundaries Actually Are

Boundaries aren't walls. They're not punishments or ultimatums. They're simply honest communication about what you can and can't do while staying healthy.

Think of them as:
- The fence around your garden (not a fortress)
- Traffic lights (guidance, not gatekeeping)
- Your emotional budget (saying no to some things so you can say yes to what matters)

## How to Start

### 1. Notice Your Resentment
If you feel drained, annoyed, or resentful after helping someone—that's a sign you need a boundary there.

### 2. Practice the Pause
"Let me check my schedule and get back to you" is a complete sentence. You don't need an excuse.

### 3. Use Simple Language
- "I can't take that on right now"
- "That doesn't work for me"
- "I need to prioritize my own wellbeing"

### 4. Expect Pushback (And Hold Steady)
People used to you saying yes might react badly to your first no. That's about them, not you. Your boundary is still valid.

## The Truth About Selfishness

Taking care of yourself isn't selfish. Saying no to things that drain you isn't mean. Protecting your peace isn't cruel.

You can't pour from an empty cup, and you don't owe anyone an explanation for keeping yours full.`,
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=600&fit=crop',
    author: {
      name: 'The Sunflower Team',
      avatar: '🌻',
    },
    category: 'Personal Growth',
    tags: ['boundaries', 'relationships', 'self-care'],
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readTimeMinutes: 6,
    featured: false,
    commentCount: 31,
    reactionCount: 102,
  },
  {
    id: '4',
    slug: 'the-quiet-work-of-showing-up',
    title: 'The Quiet Work of Showing Up',
    excerpt: 'Not every day requires a breakthrough. Sometimes just being present is enough.',
    body: `Not every day requires a breakthrough. Sometimes just being present is enough.

## The Pressure to Transform

There's this idea that every day should be productive, that every moment should teach us something, that we're always supposed to be growing, learning, becoming.

But what if some days are just about existing? About maintenance? About showing up without expecting a reward?

## What "Showing Up" Really Means

It's not about grand gestures or major changes. It's about:
- Going to therapy even when you don't feel like talking
- Taking your medication even when you feel fine
- Checking in with a friend even when you're tired
- Doing the small, unsexy work that keeps you stable

## The Value of Maintenance

We celebrate transformation—the before and after, the glow-up, the breakthrough. But we don't talk enough about maintenance.

Maintenance is:
- Keeping your space clean (or clean enough)
- Sticking to routines even when they're boring
- Doing the things that help even when they don't feel like they're working
- Showing up for yourself when no one's watching

## This Is Also Progress

The days when you just show up—when you don't have a revelation or a breakthrough or a win—those count too.

Because stability is an achievement. Consistency is growth. And sometimes, just being here is enough.`,
    coverImage: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1200&h=600&fit=crop',
    author: {
      name: 'The Sunflower Team',
      avatar: '🌻',
    },
    category: 'Mental Health',
    tags: ['consistency', 'self-care', 'progress'],
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    readTimeMinutes: 4,
    featured: false,
    commentCount: 18,
    reactionCount: 67,
  },
  {
    id: '5',
    slug: 'community-story-sarahs-journey',
    title: 'Community Story: How I Found My People',
    excerpt: 'A member shares their journey from isolation to connection, and what it meant to finally feel understood.',
    body: `A member shares their journey from isolation to connection, and what it meant to finally feel understood.

## Submitted by Sarah (she/her)

For years, I thought something was wrong with me. I couldn't relate to the way people talked about mental health in polished Instagram captions. My struggle wasn't aesthetic—it was messy, confusing, and lonely.

## The Turning Point

I found Sunflower Post during one of those 3am scrolling sessions when you're too anxious to sleep but too tired to be productive. I almost didn't click. Another mental health community? What would be different?

But something made me look. And I'm so glad I did.

## What Changed

It wasn't immediate. I lurked for weeks before posting anything. I read other people's stories and thought, "Wait, me too." I saw people being honest about the ugly parts—the medication adjustments, the therapy sessions that didn't help, the days when you can't explain why you're crying.

Then I posted in the Hope Bank. Just a small thing about getting through a hard week. And people responded—not with toxic positivity or empty platitudes, but with "I see you" and "this is hard" and "I'm proud of you."

## The Difference

Here's what I didn't expect: finding community didn't fix my problems. I still have bad days. I still struggle. But now I struggle less alone.

I have people who get it. Who don't need me to explain or justify or minimize. Who celebrate small wins because they know how big they really are.

## To Anyone Reading This

If you're lurking, wondering if this is for you—it is. You don't have to have your shit together. You don't have to be "sick enough" or "well enough." You just have to be willing to be honest.

And that's enough.`,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop',
    author: {
      name: 'Sarah (Community Member)',
      avatar: '🌸',
    },
    category: 'Community Stories',
    tags: ['community', 'connection', 'mental health'],
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    readTimeMinutes: 5,
    featured: false,
    commentCount: 43,
    reactionCount: 156,
  },
];
