function checkField(id)
{
  var path = document.getElementById("path");
  var mst = document.getElementById("mst");
  var centrality = document.getElementById("centrality");
  var connected_component = document.getElementById("connected_component");
  path.style.display = "none";
  mst.style.display = "none";
  centrality.style.display = "none";
  connected_component.style.display = "none";

  if(id == 0)
  {
    init();
    path.style.display = "block";
    path_display();
  }
  else if(id == 1)
  {
    init();
    mst.style.display = "block";
    mst_display();
  }
  else if(id == 2)
  {
    init();
    centrality.style.display = "block";
    betweenness_centrality_display();
  }
  else if(id == 3)
  {
    init();
    connected_component.style.display = "block";
    connected_component_display();
  }
  else
  {
    alert(id);
  }
}  

function node_init()
{
  node.style("fill", "#0000ff")
    .style("r", 5)
    // .style("stroke_opacity",1)
    .style("stroke-width", 1.5);
    
}

function link_width(weight)
{
  return Math.sqrt(weight)/2;
}

function link_init()
{
  link.style("stroke", "#999")
    .style("stroke-opacity", 0.6)
    .style("stroke-width", function(d){return link_width(d.weight)});
}

function init()
{
  link_init();
  node_init();
}

function get_path(i, j, path, index)
{
  if(paths[i][j] == -1)
    return index;
  if(i == j)
   ;
  else if(paths[i][j] == j) 
  {
    var targetNode  = document.getElementById(j.toString()+"_node");
    path[index++] = parseInt(targetNode.id);
  }
  else
  {
    index = get_path(i, paths[i][j], path, index);
    index = get_path(paths[i][j], j, path, index);
  } 
  return index;
}

function path_display()
{
  var sourceIndex = parseInt(document.getElementsByClassName("source")[0].value);
  var targetIndex = parseInt(document.getElementsByClassName("target")[0].value);
  if (sourceIndex >= n) 
  {
    alert("起点超过阈值" + (n-1).toString() + "!");
    return;
  };
  if (targetIndex >= n) 
  {
    alert("终点超过阈值" + (n-1).toString() + "!");
    return;
  };
  var sourceNode  = document.getElementById(sourceIndex.toString()+"_node");
  var targetNode  = document.getElementById(targetIndex.toString()+"_node");
  var path_length = document.getElementById("view_weight");
  var path = new Array(n);
  var index = 1;
  path[0] = sourceIndex;
  index = get_path(sourceIndex, targetIndex, path, index);
  if(paths[sourceIndex][targetIndex] == -1)
  {
    path_length.value = "POSITIVE_INFINITY";
    alert("起点与终点不连通");
  }
  else
  {
    var total_weight = 0;
    for (var i = 0; i < index-1; i++) 
    {
      total_weight += edges[path[i]][path[i+1]];
    }  
    path_length.value = total_weight;
    node.style("fill", function(d){
      for(var i = 0; i < index; i ++)
      {
        if(path[i] == d.index)
        {
          return "#FA0404";
        }
      }
      return "#0000ff";
    });
    link.style("stroke", function(d){
      for(var i = 0; i < index-1; i ++)
      {
        if((path[i] == d.source.index && path[i+1] == d.target.index)
          || (path[i+1] == d.source.index && path[i] == d.target.index))
        {
          return "#0A0A0A";
        }
      }
      return "#999";
    });
      link.style("stroke-opacity", function(d){
      for(var i = 0; i < index-1; i ++)
      {
        if((path[i] == d.source.index && path[i+1] == d.target.index)
          || (path[i+1] == d.source.index && path[i] == d.target.index))
        {
          return 1;
        }
      }
      return 0.1;
    });
        link.style("stroke", function(d){
      for(var i = 0; i < index-1; i ++)
      {
        if((path[i] == d.source.index && path[i+1] == d.target.index)
          || (path[i+1] == d.source.index && path[i] == d.target.index))
        {
          return "#0A0A0A";
        }
      }
      return "#999";
    });
  }
}

function mst_display()
{
  var path = new Array(n);
  var total_weight = 0;
  var root = parseInt(document.getElementsByClassName("root")[0].value);
  var path_length = document.getElementById("view_tree_weight");
  total_weight = spanning_tree(root,path);
  path_length.value = total_weight;
  node.style("fill", function(d){
    if (path[d.index].prev == -2) 
    {
      return "#FFFF00";
    };
    if(path[d.index].prev != -1)
    {
      return "#FA0404";
    };
    return "#0000ff";
  });

  // node.style("stroke_opacity", function(d){
  //   if(path[d.index].prev != -1)
  //   {
  //     return 1;
  //   };
  //   return 0.4;
  // });

  link.style("stroke", function(d){
    for(var i = 0; i < n; i ++)
    {
      if(path[i].next_num)
      {
        for (var j = 0; j < path[i].next_num; j++) 
        {
          if ((i == d.source.index && path[i].next[j] == d.target.index)
            || (path[i].next[j] == d.source.index && i == d.target.index)) 
          {
            return "#0A0A0A";
          }
        }
      }
    }
    return "#999";
  });

  link.style("stroke-opacity", function(d){
    for(var i = 0; i < n; i ++)
    {
      if(path[i].next_num)
      {
        for (var j = 0; j < path[i].next_num; j++) 
        {
          if ((i == d.source.index && path[i].next[j] == d.target.index)
            || (path[i].next[j] == d.source.index && i == d.target.index)) 
          {
            return 1;
          }
        }
      }
    }
    return 0.1;
  });
}

function SearchNode()
{
　this.dist = 0;
　this.flag = false;
  this.next = new Array(n);
  this.next_num = 0;
  this.prev = -1;
}

function spanning_tree(root,searchnode)
{
  var search_num;
  var visited_node = new Array(n);
  var path_length;
  for (var i = 0; i < n; ++i)
  {
    searchnode[i] = new SearchNode();
    searchnode[i].dist = edges[root][i];
    if (searchnode[i].dist != Number.POSITIVE_INFINITY) {searchnode[i].prev = root};
    searchnode[i].flag = false;                                // 初始都未用过该点
  }
  path_length = 0;
  search_num = 0;                                              // 选取0为初始点
  visited_node[0] = root;
  searchnode[root].dist = 0;
  searchnode[root].flag = true;
  searchnode[root].prev = -2;
  search_num++;
  for (var i = 0; i < n; i++)
  {
    if (search_num == n)
    {
      break;
    }
    var nodeFlag = false;
    var mindist = 999999;
    var u = 0;
    var j;                      // 找出当前未使用的点j的dist[j]最小值
    for (j = 0; j < n; ++j)
      if ((!searchnode[j].flag) && searchnode[j].dist < mindist)
      {
        u = j;                             // u保存当前邻接点中距离最小的点的号码 
        mindist = searchnode[j].dist;     
        nodeFlag = true;      
      }
    if (nodeFlag == false) 
    {
      break; 
    };
    searchnode[u].flag = true;
    searchnode[searchnode[u].prev].next[searchnode[searchnode[u].prev].next_num] = u;
    searchnode[searchnode[u].prev].next_num++;
    path_length += searchnode[u].dist;
    visited_node[search_num] = u;
    search_num++; 
    for (j = 0; j < n; j++)
    {
      if (!searchnode[j].flag)
      {
        for (var i = 0; i < search_num; ++i)
        {
          if (edges[visited_node[i]][j] < searchnode[j].dist)
          {
            searchnode[j].dist = edges[visited_node[i]][j];
            searchnode[j].prev = visited_node[i];
          }   
        }
      }
    }
  }
  return path_length;
}

function betweenness_centrality_display()
{
  var BC = new Array(n);
  var total = 0;
  for(var i = 0; i < n; i ++)
  {
    BC[i] = 0;
  }
  for(var i = 0; i < n; i ++)
  {
    for(var j = 0; j < n; j ++)
    {
      if(i == j) continue;
      path = new Array(n);
      path[0] = i;
      index = 1;
      index = get_path(i, j, path, index);
      for(var k = 0; k < index; k ++)
      {
        BC[path[k]] ++;
        total ++;
      }
    }
  }
  for(var i = 0; i < n; i ++)
  {
    BC[i] = BC[i] / total;
  }

  alert(BC[0]);
}

function closeness_centrality_display()
{
  alert("closeness_centrality_display");
}

function connected_component_display()
{
  var Threshold = document.getElementById("Threshold_input").value;
  link.style("stroke-width", function(d){return d.weight > Threshold ? link_width(d.weight) : 0; });
}

function Threshold_changed()
{
  var Threshold = document.getElementById("Threshold").value;
  var Threshold_output = document.getElementById("Threshold_input");
  Threshold_output.value = Threshold; 
  connected_component_display();
}

function Threshold_input_changed()
{
  var Threshold = document.getElementById("Threshold_input").value;
  var Threshold_output = document.getElementById("Threshold");
  Threshold_output.value = Threshold; 
  connected_component_display();
} 