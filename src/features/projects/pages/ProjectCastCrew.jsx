import { Plus, Search, Filter, Mail, Phone, Star, Users } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";

function ProjectCastCrew() {
  const crewMembers = [
    { name: "SARAH JOHNSON", role: "DIRECTOR", dept: "DIRECTION", status: "ACTIVE", contact: "+44 7700 900123", email: "sarah@production.com", rating: 5 },
    { name: "MIKE CHEN", role: "DOP", dept: "CAMERA", status: "ACTIVE", contact: "+44 7700 900456", email: "mike@production.com", rating: 5 },
    { name: "EMMA WILSON", role: "PRODUCER", dept: "PRODUCTION", status: "ACTIVE", contact: "+44 7700 900789", email: "emma@production.com", rating: 4 },
    { name: "ALEX MARTINEZ", role: "1ST AD", dept: "PRODUCTION", status: "ON BREAK", contact: "+44 7700 900321", email: "alex@production.com", rating: 4 },
    { name: "CHARLIE HOUSE", role: "VFX SUPERVISOR", dept: "VFX", status: "ACTIVE", contact: "+44 7700 900654", email: "charlie@production.com", rating: 5 },
    { name: "JESSICA BROWN", role: "COSTUME DESIGNER", dept: "WARDROBE", status: "ACTIVE", contact: "+44 7700 900987", email: "jessica@production.com", rating: 4 },
    { name: "TOM ANDERSON", role: "SOUND MIXER", dept: "SOUND", status: "ACTIVE", contact: "+44 7700 900111", email: "tom@production.com", rating: 5 },
    { name: "LILY PATEL", role: "MAKEUP ARTIST", dept: "MAKEUP", status: "ACTIVE", contact: "+44 7700 900222", email: "lily@production.com", rating: 4 },
  ];

  const castMembers = [
    { name: "JOHN DOE", role: "LEAD ACTOR", character: "HERO", status: "CONFIRMED", contact: "+44 7700 900555", rating: 5 },
    { name: "JANE SMITH", role: "LEAD ACTRESS", character: "HEROINE", status: "CONFIRMED", contact: "+44 7700 900666", rating: 5 },
    { name: "ROBERT WILLIAMS", role: "SUPPORTING ACTOR", character: "VILLAIN", status: "CONFIRMED", contact: "+44 7700 900777", rating: 4 },
    { name: "EMILY DAVIS", role: "SUPPORTING ACTRESS", character: "SIDEKICK", status: "PENDING", contact: "+44 7700 900888", rating: 4 },
  ];

  return (
    <div className="w-full min-h-screen space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CAST & CREW</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage project cast and crew members</p>
        </div>

        <Button size="lg">
          <Plus className="w-4 h-4" />
          ADD MEMBER
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="mb-8">
        <div className="flex items-center gap-3">

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="SEARCH CAST & CREW..."
              className="w-full pl-10 px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#9575cd]"
            />
          </div>

          {/* Filter Button */}
          <button className="p-2.5 rounded-lg border-2 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:border-[#7e57c2]">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CAST SECTION */}
      <div className="bg-background rounded-xl p-4 shadow border">
        <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">CAST</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                {["NAME", "ROLE", "CHARACTER", "STATUS", "CONTACT", "RATING"].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {castMembers.map((cast, idx) => (
                <tr key={idx} className="not-last:border-b hover:bg-[#ede7f6]/50 dark:hover:bg-gray-900">

                  <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">{cast.name}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{cast.role}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{cast.character}</td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cast.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                      {cast.status}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4">
                    <a href={`tel:${cast.contact}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#7e57c2]">
                      <Phone className="w-4 h-4" />
                      {cast.contact}
                    </a>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < cast.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                            }`}
                        />
                      ))}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREW SECTION */}
      <div className="bg-background rounded-xl p-4 shadow border">

        <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">CREW</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                {["NAME", "ROLE", "DEPARTMENT", "STATUS", "EMAIL", "CONTACT", "RATING"].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {crewMembers.map((crew, idx) => (
                <tr key={idx} className="not-last:border-b hover:bg-[#ede7f6]/50 dark:hover:bg-gray-900">

                  <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">{crew.name}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{crew.role}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{crew.dept}</td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${crew.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                      {crew.status}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4">
                    <a href={`mailto:{crew.email}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#7e57c2]">
                      <Mail className="w-4 h-4" />
                      {crew.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4">
                    <a href={`tel:${crew.contact}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#7e57c2]">
                      <Phone className="w-4 h-4" />
                      {crew.contact}
                    </a>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < crew.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                            }`}
                        />
                      ))}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default ProjectCastCrew


