import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function ComponentTest() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>VAAD HR Login Test</CardTitle>
          <CardDescription>
            Testing Shadcn components
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="Enter email" />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
            />
          </div>

          <Button variant="destructive">
            Delete Employee
          </Button>

          <Button className="w-full" variant="outline">
            Cancel
          </Button>
          <Button size="lg">
            Login
          </Button>
          <Button
            className="
 bg-primary
 hover:bg-primary-hover
"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComponentTest