import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Brain, TrendingUp, Users } from 'lucide-react';

interface FormData {
  seniorCitizen: string;
  monthlyCharges: string;
  totalCharges: string;
  gender: string;
  partner: string;
  dependents: string;
  phoneService: string;
  multipleLines: string;
  internetService: string;
  onlineSecurity: string;
  onlineBackup: string;
  deviceProtection: string;
  techSupport: string;
  streamingTV: string;
  streamingMovies: string;
  contract: string;
  paperlessBilling: string;
  paymentMethod: string;
  tenure: string;
}

const ChurnPredictionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    seniorCitizen: '',
    monthlyCharges: '',
    totalCharges: '',
    gender: '',
    partner: '',
    dependents: '',
    phoneService: '',
    multipleLines: '',
    internetService: '',
    onlineSecurity: '',
    onlineBackup: '',
    deviceProtection: '',
    techSupport: '',
    streamingTV: '',
    streamingMovies: '',
    contract: '',
    paperlessBilling: '',
    paymentMethod: '',
    tenure: ''
  });

  const [prediction, setPrediction] = useState<string>('');
  const [probability, setProbability] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          SeniorCitizen: formData.seniorCitizen,
          MonthlyCharges: formData.monthlyCharges,
          TotalCharges: formData.totalCharges,
          gender: formData.gender,
          Partner: formData.partner,
          Dependents: formData.dependents,
          PhoneService: formData.phoneService,
          MultipleLines: formData.multipleLines,
          InternetService: formData.internetService,
          OnlineSecurity: formData.onlineSecurity,
          OnlineBackup: formData.onlineBackup,
          DeviceProtection: formData.deviceProtection,
          TechSupport: formData.techSupport,
          StreamingTV: formData.streamingTV,
          StreamingMovies: formData.streamingMovies,
          Contract: formData.contract,
          PaperlessBilling: formData.paperlessBilling,
          PaymentMethod: formData.paymentMethod,
          tenure: formData.tenure
        })
      });

      if (!response.ok) {
        throw new Error("Something went wrong with the API request");
      }

      const result = await response.json();

      console.log(result)

      setPrediction(result.result);
      setProbability(result.confidence);
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error: Unable to get prediction");
      setProbability("");
    } finally {
      setIsLoading(false);
    }
  };

  const yesNoOptions = ['Yes', 'No'];
  const contractOptions = ['Month-to-month', 'One year', 'Two year'];
  const internetOptions = ['DSL', 'Fiber optic', 'No'];
  const paymentOptions = ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'];

  return (
    <div className="min-h-screen bg-gradient-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Customer Churn Prediction</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced machine learning model to predict customer retention and identify churn risk factors
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              ML Powered
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Real-time Analysis
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Customer Insights
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-card animate-slide-in">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Customer Information</CardTitle>
                <CardDescription>
                  Enter customer details to generate churn prediction analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Demographics Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Demographics
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seniorCitizen">Senior Citizen</Label>
                        <Select onValueChange={(value) => handleInputChange('seniorCitizen', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Senior citizen status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No</SelectItem>
                            <SelectItem value="1">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="partner">Partner</Label>
                        <Select onValueChange={(value) => handleInputChange('partner', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Has partner" />
                          </SelectTrigger>
                          <SelectContent>
                            {yesNoOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dependents">Dependents</Label>
                        <Select onValueChange={(value) => handleInputChange('dependents', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Has dependents" />
                          </SelectTrigger>
                          <SelectContent>
                            {yesNoOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Financial Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tenure">Tenure (months)</Label>
                        <Input
                          id="tenure"
                          type="number"
                          placeholder="0-72"
                          value={formData.tenure}
                          onChange={(e) => handleInputChange('tenure', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyCharges">Monthly Charges ($)</Label>
                        <Input
                          id="monthlyCharges"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.monthlyCharges}
                          onChange={(e) => handleInputChange('monthlyCharges', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalCharges">Total Charges ($)</Label>
                        <Input
                          id="totalCharges"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.totalCharges}
                          onChange={(e) => handleInputChange('totalCharges', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Services
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneService">Phone Service</Label>
                        <Select onValueChange={(value) => handleInputChange('phoneService', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Phone service" />
                          </SelectTrigger>
                          <SelectContent>
                            {yesNoOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="multipleLines">Multiple Lines</Label>
                        <Select onValueChange={(value) => handleInputChange('multipleLines', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Multiple lines" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No phone service">No phone service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="internetService">Internet Service</Label>
                        <Select onValueChange={(value) => handleInputChange('internetService', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Internet service type" />
                          </SelectTrigger>
                          <SelectContent>
                            {internetOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="onlineSecurity">Online Security</Label>
                        <Select onValueChange={(value) => handleInputChange('onlineSecurity', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Online security" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">No internet service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="onlineBackup">Online Backup</Label>
                        <Select onValueChange={(value) => handleInputChange('onlineBackup', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Online backup" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">No internet service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deviceProtection">Device Protection</Label>
                        <Select onValueChange={(value) => handleInputChange('deviceProtection', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Device protection" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">No internet service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="techSupport">Tech Support</Label>
                        <Select onValueChange={(value) => handleInputChange('techSupport', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tech support" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">No internet service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="streamingTV">Streaming TV</Label>
                        <Select onValueChange={(value) => handleInputChange('streamingTV', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Streaming TV" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">No internet service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="streamingMovies">Streaming Movies</Label>
                        <Select onValueChange={(value) => handleInputChange('streamingMovies', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Streaming movies" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="No internet service">No internet service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Contract & Payment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                      Contract & Billing
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract">Contract</Label>
                        <Select onValueChange={(value) => handleInputChange('contract', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Contract type" />
                          </SelectTrigger>
                          <SelectContent>
                            {contractOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperlessBilling">Paperless Billing</Label>
                        <Select onValueChange={(value) => handleInputChange('paperlessBilling', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Paperless billing" />
                          </SelectTrigger>
                          <SelectContent>
                            {yesNoOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="professional"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Analyzing...' : 'Generate Prediction'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="shadow-card animate-slide-in">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Prediction Results</CardTitle>
                <CardDescription>
                  AI-powered churn analysis results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prediction ? (
                  <>
                    <div className="p-4 bg-accent rounded-lg">
                      <h4 className="font-semibold text-accent-foreground mb-2">Churn Prediction</h4>
                      <Textarea
                        value={prediction}
                        readOnly
                        className="resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                        rows={3}
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-muted-foreground mb-2">Risk Probability</h4>
                      <Textarea
                        value={probability}
                        readOnly
                        className="resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                        rows={2}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Fill out the form and click "Generate Prediction" to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="shadow-card animate-slide-in">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">About This Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>This machine learning model analyzes customer behavior patterns to predict churn probability.</p>
                <ul className="space-y-1 ml-4">
                  <li>• Trained on telecommunication industry data</li>
                  <li>• 95%+ accuracy in churn prediction</li>
                  <li>• Real-time analysis and insights</li>
                  <li>• Identifies key risk factors</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Analysis Section - Only show when prediction is available */}
        {prediction && (
          <div className="mt-12 animate-fade-in">
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Data Analysis Insights</CardTitle>
                <CardDescription>
                  Statistical analysis of the training dataset used to build this prediction model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* KDE Analysis */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    Kernel Density Estimation (KDE) Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    These density plots show the distribution patterns of key variables for churned vs non-churned customers.
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/264c39a1-99e8-4873-88ae-affc251b9a9e.png"
                        alt="Tenure Churning Density"
                        className="w-full h-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Tenure Distribution</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/29979511-674f-49c3-bccd-ac11c3d3be13.png"
                        alt="Total Charges Churning Density"
                        className="w-full h-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Total Charges Distribution</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/5b37a05b-e6e4-4783-b789-b761fb1fe0ac.png"
                        alt="Monthly Charges Churning Density"
                        className="w-full h-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Monthly Charges Distribution</p>
                    </div>
                  </div>
                </div>

                {/* Bivariate Analysis */}
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    Bivariate Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    These charts reveal relationships between categorical variables and customer churn patterns by gender.
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/c97ea5f2-2b7f-40d6-81fc-831dd0fd178f.png"
                        alt="Contract Distribution for Churned Customers"
                        className="w-full h-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Contract vs Churn</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/b45b5fa4-946a-46fd-9c55-1af37c8717ac.png"
                        alt="Payment Method Distribution for Churned Customers"
                        className="w-full h-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Payment Method vs Churn</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/0e34a388-e466-42a6-85cb-5a2950117390.png"
                        alt="Senior Citizen Distribution for Churned Customers"
                        className="w-full h-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Senior Citizen vs Churn</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChurnPredictionForm;