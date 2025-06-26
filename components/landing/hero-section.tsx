"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  <span className="text-primary">Smart</span> Waste Management with AI Vision
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-muted-foreground text-lg md:text-xl">
                  Sortify combines AI-powered smart bins with blockchain incentives to revolutionize waste collection
                  and recycling.
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col md:flex-row gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg">
                <Link href="/collection">Request Collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/marketplace">Visit Marketplace</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[350px] w-full max-w-[500px] overflow-hidden rounded-xl bg-muted/50 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/5 rounded-xl"></div>
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Waste collection and recycling illustration"
                className="h-full w-full object-cover rounded-lg"
                width={800}
                height={600}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
