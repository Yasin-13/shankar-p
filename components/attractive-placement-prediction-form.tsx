'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Upload, Briefcase, GraduationCap } from 'lucide-react'

export function AttractivePlacementPredictionFormComponent() {
  const [formData, setFormData] = useState({
    gender: '',
    stream: '',
    internship: '',
    cgpa: '',
    backlogs: '',
    resumeFile: null as File | null,
  })
  const [prediction, setPrediction] = useState<{ placement_message: string, job_role_prediction: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, resumeFile: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value)
      }
    })

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError('An error occurred while fetching the prediction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <GraduationCap size={28} />
            Placement Predictor
          </CardTitle>
          <CardDescription className="text-purple-100">
            Discover your career potential with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream" className="text-sm font-medium text-gray-700">Stream</Label>
                <Select name="stream" onValueChange={(value) => handleSelectChange('stream', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="internship" className="text-sm font-medium text-gray-700">Internships</Label>
                <Input type="number" id="internship" name="internship" onChange={handleInputChange} required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa" className="text-sm font-medium text-gray-700">CGPA</Label>
                <Input type="number" id="cgpa" name="cgpa" step="0.01" min="0" max="10" onChange={handleInputChange} required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backlogs" className="text-sm font-medium text-gray-700">Backlogs</Label>
                <Input type="number" id="backlogs" name="backlogs" onChange={handleInputChange} required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-sm font-medium text-gray-700">Resume (PDF or DOCX)</Label>
                <div className="flex items-center space-x-2">
                  <Input type="file" id="resume" name="resume" accept=".pdf,.docx" onChange={handleFileChange} required className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('resume')?.click()} className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Upload Resume
                  </Button>
                </div>
                {formData.resumeFile && (
                  <p className="text-sm text-gray-500 mt-1">{formData.resumeFile.name}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Predict My Future'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start bg-gray-50 rounded-b-lg">
          {error && (
            <div className="flex items-center space-x-2 text-red-500 mb-4 w-full bg-red-50 p-3 rounded">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          {prediction && (
            <div className="space-y-4 w-full">
              <div className={`flex items-center space-x-2 p-4 rounded ${prediction.placement_message.includes('high chances') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {prediction.placement_message.includes('high chances') ? (
                  <CheckCircle size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
                <p className="font-medium">{prediction.placement_message}</p>
              </div>
              <div className="bg-indigo-100 text-indigo-800 p-4 rounded flex items-center space-x-2">
                <Briefcase size={24} />
                <div>
                  <p className="font-semibold">Predicted Job Role:</p>
                  <p>{prediction.job_role_prediction}</p>
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}