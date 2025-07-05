import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const email = 'admin@platform.com';
  const plainPassword = 'admin123'; // Change before production
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if the admin user already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!existing) {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        admin: {
          create: {
            name: 'Super Admin',
          },
        },
      },
    });

    console.log(`✅ Default admin created: ${user.email}`);
  } else {
    console.log(`⚠️ Admin already exists: ${existing.email}`);
  }

  await prisma.vendorCategory.createMany({
    data: [
      { name: "Manufacturing Tools" },
      { name: "Industrial Electronics" },
      { name: "Safety Equipment" },
      { name: "Hardware & Fasteners" },
      { name: "Construction Materials" },
      { name: "Electrical Supplies" },
      { name: "Mechanical Components" },
      { name: "Hydraulics & Pneumatics" },
      { name: "Packaging & Warehousing" },
      { name: "Automotive & Spare Parts" },
      { name: "HVAC & Ventilation" },
      { name: "Chemical & Lab Equipment" },
      { name: "Welding & Soldering" },
      { name: "Solar & Renewable Energy" },
      { name: "IT & Networking Hardware" },
      { name: "Medical & Hospital Supplies" },
      { name: "Cleaning & Maintenance" },
      { name: "Agriculture & Farming Tools" },
      { name: "Mining & Earthmoving" },
      { name: "Marine & Offshore Equipment" },
    ],
  });

  await prisma.productCategory.createMany({
    data: [
      { name: "Power Tools" },
      { name: "Hand Tools" },
      { name: "CNC Machines" },
      { name: "Measuring Instruments" },

      { name: "Sensors" },
      { name: "Controllers & PLCs" },
      { name: "Relays & Circuit Breakers" },
      { name: "Industrial Cables & Connectors" },

      { name: "Protective Gear" },
      { name: "Fire Safety" },
      { name: "Eye & Face Protection" },
      { name: "Ear Protection" },

      { name: "Bolts & Screws" },
      { name: "Nuts & Washers" },
      { name: "Bearings & Bushings" },
      { name: "Anchors & Rivets" },

      { name: "Cement & Concrete" },
      { name: "Steel & Rebars" },
      { name: "Bricks & Blocks" },
      { name: "Roofing & Cladding" },

      { name: "Wires & Cables" },
      { name: "Switches & Sockets" },
      { name: "Circuit Protection" },
      { name: "Transformers" },

      { name: "Gears & Couplings" },
      { name: "Pumps & Motors" },
      { name: "Valves" },
      { name: "Shafts & Chains" },

      { name: "Hydraulic Pumps" },
      { name: "Pneumatic Cylinders" },
      { name: "Seals & Fittings" },

      { name: "Stretch Films" },
      { name: "Packaging Machines" },
      { name: "Storage Racks" },
      { name: "Pallets & Crates" },

      { name: "Vehicle Batteries" },
      { name: "Lubricants & Oils" },
      { name: "Engine Parts" },

      { name: "Air Conditioners" },
      { name: "Ducting & Pipes" },
      { name: "Fans & Blowers" },

      { name: "Industrial Chemicals" },
      { name: "Glassware & Lab Tools" },
      { name: "PH & Conductivity Meters" },

      { name: "Welding Machines" },
      { name: "Soldering Kits" },
      { name: "Welding Electrodes" },

      { name: "Solar Panels" },
      { name: "Solar Inverters" },
      { name: "Charge Controllers" },

      { name: "Network Switches" },
      { name: "Patch Panels" },
      { name: "Servers & Storage" },

      { name: "Gloves & PPE" },
      { name: "Hospital Beds" },
      { name: "Diagnostics Equipment" },

      { name: "Industrial Vacuums" },
      { name: "Cleaning Chemicals" },
      { name: "Mops & Brooms" },

      { name: "Irrigation Equipment" },
      { name: "Harvesting Tools" },
      { name: "Fertilizer Spreaders" },

      { name: "Marine Ropes" },
      { name: "Life Jackets" },
      { name: "Navigation Lights" }
    ],
  });

  console.log("✅ Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
