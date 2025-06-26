"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy, Users, Star, Lock } from "lucide-react"
import Image from 'next/image'

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("achievements")

  // Mock achievements data
  const achievements = [
    {
      id: "1",
      title: "First Recycler",
      description: "Use a smart bin for the first time",
      icon: <Award className="h-6 w-6 text-primary" />,
      progress: 100,
      completed: true,
      date: "2023-03-15",
      reward: "10 tokens",
    },
    {
      id: "2",
      title: "Waste Warrior",
      description: "Recycle 10kg of waste",
      icon: <Award className="h-6 w-6 text-primary" />,
      progress: 65,
      completed: false,
      reward: "25 tokens",
    },
    {
      id: "3",
      title: "Plastic Eliminator",
      description: "Recycle 5kg of plastic waste",
      icon: <Award className="h-6 w-6 text-primary" />,
      progress: 40,
      completed: false,
      reward: "15 tokens",
    },
    {
      id: "4",
      title: "Collection Champion",
      description: "Schedule 5 waste collections",
      icon: <Award className="h-6 w-6 text-primary" />,
      progress: 20,
      completed: false,
      reward: "20 tokens",
    },
    {
      id: "5",
      title: "Marketplace Maven",
      description: "Complete your first transaction in the marketplace",
      icon: <Award className="h-6 w-6 text-primary" />,
      progress: 0,
      completed: false,
      reward: "15 tokens",
    },
    {
      id: "6",
      title: "Eco Influencer",
      description: "Refer 3 friends to Sortify",
      icon: <Award className="h-6 w-6 text-primary" />,
      progress: 0,
      completed: false,
      reward: "30 tokens",
    },
  ]

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: "EcoWarrior", points: 1250, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 2, name: "GreenGuru", points: 1120, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 3, name: "RecycleKing", points: 980, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 4, name: "EarthDefender", points: 875, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 5, name: "WasteWizard", points: 820, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 6, name: "PlanetProtector", points: 760, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 7, name: "GreenThumb", points: 710, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 8, name: "EcoHero", points: 650, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 9, name: "RecycleQueen", points: 590, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 10, name: "SustainableSage", points: 540, avatar: "/placeholder.svg?height=40&width=40" },
  ]

  // Mock challenges data
  const challenges = [
    {
      id: "1",
      title: "Spring Cleaning Challenge",
      description: "Recycle 20kg of waste during April",
      startDate: "2023-04-01",
      endDate: "2023-04-30",
      participants: 128,
      reward: "100 tokens + special badge",
      progress: 25,
      active: true,
    },
    {
      id: "2",
      title: "Plastic-Free July",
      description: "Recycle 10kg of plastic waste during July",
      startDate: "2023-07-01",
      endDate: "2023-07-31",
      participants: 0,
      reward: "150 tokens + special badge",
      progress: 0,
      active: false,
    },
    {
      id: "3",
      title: "Community Cleanup",
      description: "Participate in a community cleanup event",
      startDate: "2023-05-15",
      endDate: "2023-05-20",
      participants: 45,
      reward: "75 tokens + special badge",
      progress: 0,
      active: true,
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements & Leaderboards</h1>
          <p className="text-muted-foreground">Track your progress, earn rewards, and compete with others</p>
        </div>
      </div>

      <Tabs defaultValue="achievements" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">
            <Trophy className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Users className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Star className="mr-2 h-4 w-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1/6</div>
                <p className="text-xs text-muted-foreground">16% completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tokens Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10</div>
                <p className="text-xs text-muted-foreground">From achievements</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Waste Warrior</div>
                <p className="text-xs text-muted-foreground">65% progress</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.completed ? "border-primary/50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {achievement.icon}
                      {achievement.completed && (
                        <Badge variant="default" className="ml-2">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-medium text-primary">{achievement.reward}</div>
                  </div>
                  <CardTitle className="text-lg mt-2">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                    {achievement.completed && achievement.date && (
                      <p className="text-xs text-muted-foreground">Completed on {achievement.date}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#42</div>
                <p className="text-xs text-muted-foreground">Top 15%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320</div>
                <p className="text-xs text-muted-foreground">+45 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Next Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#41</div>
                <p className="text-xs text-muted-foreground">Need 15 more points</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Top recyclers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Rank</th>
                      <th className="py-3 px-4 text-left font-medium">User</th>
                      <th className="py-3 px-4 text-left font-medium">Points</th>
                      <th className="py-3 px-4 text-left font-medium">Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((user) => (
                      <tr key={user.rank} className="border-b">
                        <td className="py-3 px-4 font-medium">
                          {user.rank <= 3 ? (
                            <div
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                              ${
                                user.rank === 1
                                  ? "bg-yellow-100 text-yellow-700"
                                  : user.rank === 2
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {user.rank}
                            </div>
                          ) : (
                            user.rank
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="w-8 h-8 rounded-full mr-2"
                              width={40}
                              height={40}
                            />
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.points}</td>
                        <td className="py-3 px-4">
                          {user.rank <= 3 ? (
                            <Badge variant={user.rank === 1 ? "default" : "outline"}>
                              {user.rank === 1 ? "Gold" : user.rank === 2 ? "Silver" : "Bronze"}
                            </Badge>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Participate to earn rewards</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Keep recycling!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Potential Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">325</div>
                <p className="text-xs text-muted-foreground">Tokens available to earn</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{challenge.title}</CardTitle>
                    {challenge.active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">
                        <Lock className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Duration</span>
                    <span>
                      {challenge.startDate} to {challenge.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Participants</span>
                    <span>{challenge.participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reward</span>
                    <span className="font-medium text-primary">{challenge.reward}</span>
                  </div>

                  {challenge.active && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
