import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const email = process.env.ADMIN_EMAIL ?? 'admin@sslotsync.com';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin user ready: ${admin.email}`);

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: 'Arjun Mehta',
          role: 'CEO, TechNova Solutions',
          text: 'The precision of the web architecture delivered by Sslotsync is unparalleled. Our conversion rates increased by 40% within two months of the re-launch.',
          avatar: 'AM',
          location: 'Mumbai, India',
          order: 0,
        },
        {
          name: 'Priya Sharma',
          role: 'Founder, LuxeCraft',
          text: 'Vibrant designs that capture the essence of luxury. They understood our brand vision even better than we did. Truly a premium experience.',
          avatar: 'PS',
          location: 'Delhi, India',
          order: 1,
        },
        {
          name: 'Vikram Reddy',
          role: 'Digital Head, UrbanStyle',
          text: "Sslotsync doesn't just build websites; they build digital legacies. Their attention to performance and SEO is what sets them apart from the rest.",
          avatar: 'VR',
          location: 'Bangalore, India',
          order: 2,
        },
      ],
    });
    console.log('Seeded testimonials');
  }

  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: 'Satyam Soni',
          role: 'Chief Executive Architect',
          specialty: 'Full Stack Engineering',
          bio: 'A technical powerhouse dedicated to architecting high-performance digital ecosystems. Satyam leads the technical direction, ensuring every line of code serves a strategic purpose in building global legacies.',
          initials: 'SS',
          linkedin: 'https://www.linkedin.com/in/satyam-soni-833873293/',
          order: 0,
        },
        {
          name: 'Karthikey Pandey',
          role: 'Head of Systems Architecture',
          specialty: 'Scalable Infrastructure',
          bio: 'The engineering force behind our most complex structures. Karthikey bridges hardware-level logic with cloud-native performance, building foundations that never fail.',
          initials: 'KP',
          linkedin: 'https://www.linkedin.com/in/kartikeypandey45/',
          order: 1,
        },
        {
          name: 'Tarun Singh',
          role: 'Director of Digital Art',
          specialty: 'Brand Narrative & UX',
          bio: 'The artistic visionary responsible for the visual soul of SslotSync. Tarun transforms abstract concepts into breathtaking digital realities that redefine industry standards.',
          initials: 'TS',
          linkedin: 'https://www.linkedin.com/in/tarun-bhadouria-/',
          order: 2,
        },
      ],
    });
    console.log('Seeded team members');
  }

  const pricingCount = await prisma.pricingPlan.count();
  if (pricingCount === 0) {
    await prisma.pricingPlan.createMany({
      data: [
        {
          name: 'Essential',
          price: '500',
          description: 'Scalable landing solution.',
          features: ['1-Page Website', 'Responsive Design', 'SEO Basic', 'Standard Support'],
          iconName: 'Zap',
          highlight: false,
          order: 0,
        },
        {
          name: 'Standard',
          price: '1,200',
          description: 'The premium standard for brands.',
          features: ['3-Page Website', 'Full UI Kit', 'Advanced SEO', 'VIP Support'],
          iconName: 'Rocket',
          highlight: true,
          order: 1,
        },
        {
          name: 'Professional',
          price: '2,500',
          description: 'Enterprise-grade digital build.',
          features: ['5-Page Website', 'Software Integration', 'Dedicated Server', 'Lifetime Support'],
          iconName: 'Building',
          highlight: false,
          order: 2,
        },
      ],
    });
    console.log('Seeded pricing plans');
  }

  const contentCardCount = await prisma.contentCard.count();
  if (contentCardCount === 0) {
    await prisma.contentCard.createMany({
      data: [
        {
          section: 'enterprise',
          title: 'HealthCore Systems',
          description: 'Enterprise-grade healthcare management for elite medical institutions.',
          features: ['Patient Lifecycle', 'Doctor Scheduling', 'Analytic Reports', 'Inventory'],
          tags: ['Cloud', 'Secure', 'React'],
          iconName: 'Building2',
          order: 0,
        },
        {
          section: 'enterprise',
          title: 'EduSync Suite',
          description: 'Digital transformation for prestigious educational organizations.',
          features: ['Biometric Sync', 'Real-time Ops', 'Automated Flows', 'Portals'],
          tags: ['Mobile', 'Live', 'Auth'],
          iconName: 'Users',
          order: 1,
        },
        {
          section: 'enterprise',
          title: 'Bespoke Enterprise',
          description: 'Tailored software architecture for complex business workflows.',
          features: ['Custom Logic', 'API Mastery', 'Scalable DB', 'User Roles'],
          tags: ['Node', 'SQL', 'Optimized'],
          iconName: 'Code2',
          order: 2,
        },
        {
          section: 'social',
          title: 'Visual Identity',
          description: "Artisanal graphics that embody your brand's philosophy.",
          features: ['Brand Guidelines', 'Logo Design', 'Color Logic', 'Typography'],
          tags: [],
          iconName: 'Palette',
          order: 0,
        },
        {
          section: 'social',
          title: 'Social Curation',
          description: 'Elite management of your digital social presence.',
          features: ['Content Strategy', 'Growth Logic', 'Engagement', 'Analytics'],
          tags: [],
          iconName: 'Instagram',
          order: 1,
        },
        {
          section: 'social',
          title: 'Content Mastery',
          description: 'Breathtaking visuals for high-impact marketing.',
          features: ['Video Assets', 'Static Designs', 'Copywriting', 'Trends'],
          tags: [],
          iconName: 'Sparkles',
          order: 2,
        },
      ],
    });
    console.log('Seeded content cards');
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
