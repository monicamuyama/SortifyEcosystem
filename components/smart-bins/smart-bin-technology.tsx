import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scan, Cpu, Recycle, BarChart } from "lucide-react"
import Image from 'next/image'

export function SmartBinTechnology() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Our Smart Bin Technology</h2>
        <p className="text-muted-foreground">
          Sortify's smart bins use advanced computer vision and machine learning to automatically sort and categorize
          waste, making recycling easier and more efficient than ever before.
        </p>
      </div>

      <Tabs defaultValue="vision" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="vision">
            <Scan className="h-4 w-4 mr-2" />
            Computer Vision
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Cpu className="h-4 w-4 mr-2" />
            AI Processing
          </TabsTrigger>
          <TabsTrigger value="sorting">
            <Recycle className="h-4 w-4 mr-2" />
            Automated Sorting
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Data Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vision" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Advanced Computer Vision</h3>
              <p className="mb-4">
                Our smart bins are equipped with high-resolution cameras that capture images of waste items as they&apos;re
                deposited. These cameras work in real-time to identify the type of material being discarded.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Multi-angle imaging for accurate identification</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Works in various lighting conditions</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Can identify multiple items simultaneously</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>97% accuracy in material identification</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Computer Vision Technology"
                className="w-full h-auto"
                width={400}
                height={300}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-lg overflow-hidden border">
              <Image src="/placeholder.svg?height=300&width=400" alt="AI Processing" className="w-full h-auto" width={400} height={300} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Processing</h3>
              <p className="mb-4">
                Our proprietary machine learning algorithms analyze the images captured by the cameras to classify waste
                items into appropriate categories. The system continuously learns and improves over time.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Neural networks trained on millions of waste images</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Real-time classification in under 500ms</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Continuous learning from new waste items</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Edge computing for privacy and speed</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sorting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Automated Sorting System</h3>
              <p className="mb-4">
                Once waste is identified, our smart bins use a sophisticated mechanical system to sort items into
                appropriate compartments. This ensures that different types of waste are properly separated for
                recycling.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Separate compartments for different waste types</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Automated compaction to maximize capacity</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Fill level sensors for efficient collection</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Solar-powered operation for sustainability</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Automated Sorting System"
                className="w-full h-auto"
                width={400}
                height={300}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-lg overflow-hidden border">
              <Image src="/placeholder.svg?height=300&width=400" alt="Data Analytics" className="w-full h-auto" width={400} height={300} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Real-time Data Analytics</h3>
              <p className="mb-4">
                Our smart bins are connected to the cloud, providing real-time data on waste collection, sorting
                accuracy, and bin capacity. This data helps optimize collection routes and improve recycling efficiency.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>IoT connectivity for real-time monitoring</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Predictive analytics for collection scheduling</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Waste trend analysis for community insights</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>Integration with blockchain for token rewards</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 rounded-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">How Our Smart Bins Work</h3>
          <p className="text-muted-foreground">A simple step-by-step process</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">1</span>
              </div>
              <CardTitle className="text-base">Waste Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>User deposits waste item into the smart bin&apos;s intake area</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">2</span>
              </div>
              <CardTitle className="text-base">Image Capture</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Cameras capture multiple images of the waste item from different angles</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">3</span>
              </div>
              <CardTitle className="text-base">AI Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI algorithms identify the material type and appropriate recycling category
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-primary font-bold">4</span>
              </div>
              <CardTitle className="text-base">Automated Sorting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Item is automatically sorted into the appropriate compartment for recycling
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
