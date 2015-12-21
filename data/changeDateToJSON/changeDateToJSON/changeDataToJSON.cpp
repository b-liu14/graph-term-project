/* ************************************************************************** 
/* 
/*   changeDataToJSON.cpp                               
/*                                                                            
/*   By: 刘斌 <b-liu14@mails.tsinghua.edu.cn>                                                                         
/*
/*   Created: 2015/12/20 09:08:52 by 刘斌                                                                           
/*   Updated: 2015/12/20 09:55:35 by 刘斌                  
/*                                                                      
/*   System  Environment: windows10 education
/*   Delelop Environment: sublime text 3 
/*   
/* **************************************************************************/ 

#include <fstream>
#include <vector>
#include <string>
#include <cstring>
using namespace std;
int maxn = 50;
std::vector<int> source;
std::vector<int> target;
std::vector<double> weight;
std::vector<string> ID;
std::vector<string> name;
int main()
{
	fstream fout_temp("node.txt", ios::out);
	for(int i = 0; i < 971; i ++)
		if(i < maxn)
			fout_temp << "ID" << i << " name" << i << endl;
	fout_temp.close();
	fstream fin_links("link.txt", ios::in);
	fstream fin_nodes("node.txt", ios::in);
	fstream fout_graph("../../graph.json", ios::out);
	int s, t;
	double w;
	while(fin_links >> s >> t >> w)
	{
		if(s < maxn && t < maxn)
		{
			source.push_back(s);
			target.push_back(t);
			weight.push_back(w);
		}
		
	}
	string id, n;
	while(fin_nodes >> id >> n)
	{
		ID.push_back(id);
		name.push_back(n);
	}
	fout_graph << "{" << endl;
	fout_graph << "	\"nodes\":" << endl;
	fout_graph << "	[" << endl;
	for(int i = 0; i < ID.size()-1; i ++)
	{
		fout_graph << "		{" << endl;
		fout_graph << "			\"ID\": \"" << ID[i] << "\"," << endl;
		fout_graph << "			\"name\": \"" << name[i] << "\"" << endl;
		fout_graph << "		}," << endl;
	}
	fout_graph << "		{" << endl;
	fout_graph << "			\"ID\": \"" << ID.back() << "\"," << endl;
	fout_graph << "			\"name\": \"" << name.back() << "\"" << endl;
	fout_graph << "		}" << endl;
	fout_graph << "	 ]," << endl;
	fout_graph << "	\"links\":" << endl;
	fout_graph << "	[" << endl;
	for(int i = 0; i < source.size()-1; i ++)
	{
		fout_graph << "		{" << endl;
		fout_graph << "			\"source\": " << source[i] << "," << endl;
		fout_graph << "			\"target\": " << target[i] << "" << endl;
		fout_graph << "		}," << endl;
	}
	fout_graph << "		{" << endl;
	fout_graph << "			\"source\": " << source.back() << "," << endl;
	fout_graph << "			\"target\": " << target.back() << "" << endl;
	fout_graph << "		}" << endl;
	fout_graph << "	 ]" << endl;
	fout_graph << "}" << endl;
	return 0;
}