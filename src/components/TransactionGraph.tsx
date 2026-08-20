import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Share2, RotateCcw, X } from 'lucide-react';
import type { EthTransaction } from '../types/blockchain';
import { shortenAddress } from '../utils/formatters';

interface TransactionGraphProps {
  transactions: EthTransaction[];
  onSelectTx: (tx: EthTransaction) => void;
  onTrackWallet: (address: string) => void;
  trackedAddress: string | null;
}

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  shortAddress: string;
  txCount: number;
  totalSentEth: number;
  totalReceivedEth: number;
  isRepeated: boolean;
  isSearched: boolean;
  counterparties: string[];
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  source: string | NodeData;
  target: string | NodeData;
  value: number;
  hash: string;
  tx: EthTransaction;
}

export const TransactionGraph: React.FC<TransactionGraphProps> = ({
  transactions,
  onSelectTx,
  onTrackWallet,
  trackedAddress,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [minEthFilter, setMinEthFilter] = useState<number>(0);

  // Build Graph Nodes & Links from transactions
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NodeData>();
    const linkList: LinkData[] = [];

    const relevantTxs = transactions.slice(0, 40).filter((tx) => {
      const val = parseFloat(tx.value) || 0;
      return val >= minEthFilter;
    });

    relevantTxs.forEach((tx) => {
      if (!tx.from) return;
      const fromAddr = tx.from;
      const toAddr = tx.to || 'contract_creation';
      const val = parseFloat(tx.value) || 0;

      // Add/Update From Node
      if (!nodeMap.has(fromAddr)) {
        nodeMap.set(fromAddr, {
          id: fromAddr,
          shortAddress: shortenAddress(fromAddr),
          txCount: 0,
          totalSentEth: 0,
          totalReceivedEth: 0,
          isRepeated: false,
          isSearched: trackedAddress ? trackedAddress.toLowerCase() === fromAddr : false,
          counterparties: [],
        });
      }
      const fromNode = nodeMap.get(fromAddr)!;
      fromNode.txCount++;
      fromNode.totalSentEth += val;
      if (toAddr !== 'contract_creation' && !fromNode.counterparties.includes(toAddr)) {
        fromNode.counterparties.push(toAddr);
      }

      // Add/Update To Node
      if (!nodeMap.has(toAddr)) {
        nodeMap.set(toAddr, {
          id: toAddr,
          shortAddress: toAddr === 'contract_creation' ? 'Contract' : shortenAddress(toAddr),
          txCount: 0,
          totalSentEth: 0,
          totalReceivedEth: 0,
          isRepeated: false,
          isSearched: trackedAddress ? trackedAddress.toLowerCase() === toAddr : false,
          counterparties: [],
        });
      }
      const toNode = nodeMap.get(toAddr)!;
      toNode.txCount++;
      toNode.totalReceivedEth += val;
      if (!toNode.counterparties.includes(fromAddr)) {
        toNode.counterparties.push(fromAddr);
      }

      // Add Link
      linkList.push({
        source: fromAddr,
        target: toAddr,
        value: val,
        hash: tx.hash,
        tx,
      });
    });

    nodeMap.forEach((n) => {
      n.isRepeated = n.txCount >= 2;
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkList,
    };
  }, [transactions, minEthFilter, trackedAddress]);

  // Setup D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 460;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('class', 'graph-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', 'rgba(138, 124, 255, 0.4)');

    const simulation = d3.forceSimulation<NodeData>(nodes)
      .force('link', d3.forceLink<NodeData, LinkData>(links).id((d) => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => (d.isRepeated ? 32 : 22)));

    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d) => (d.value > 0.5 ? 'rgba(53, 208, 127, 0.5)' : 'rgba(255, 255, 255, 0.12)'))
      .attr('stroke-width', (d) => Math.max(1, Math.min(4, 1 + d.value * 0.8)))
      .attr('marker-end', 'url(#arrowhead)')
      .attr('cursor', 'pointer')
      .on('click', (_, d) => {
        onSelectTx(d.tx);
      });

    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, NodeData>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (_, d) => {
        setSelectedNode(d);
      });

    node.filter((d) => d.isRepeated || d.isSearched)
      .append('circle')
      .attr('r', (d) => (d.isRepeated ? 18 : 16))
      .attr('fill', 'none')
      .attr('stroke', (d) => (d.isSearched ? '#35D07F' : '#8A7CFF'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.8);

    node.append('circle')
      .attr('r', (d) => (d.isRepeated ? 14 : 10))
      .attr('fill', (d) => {
        if (d.isSearched) return '#35D07F';
        if (d.isRepeated) return '#8A7CFF';
        if (d.id === 'contract_creation') return '#F5B84B';
        return '#1F1F1F';
      })
      .attr('stroke', (d) => (d.isRepeated ? '#B6ADFF' : 'rgba(255,255,255,0.2)'))
      .attr('stroke-width', 1.5);

    node.append('text')
      .text((d) => d.shortAddress)
      .attr('x', 0)
      .attr('y', (d) => (d.isRepeated ? 26 : 22))
      .attr('text-anchor', 'middle')
      .attr('fill', '#A0A0A0')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, onSelectTx]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(d3.zoom().transform as any, d3.zoomIdentity);
  };

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Header & Graph Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#8A7CFF]" />
            <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Transaction Network Graph
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Force-directed visual topology: Nodes represent pseudonymous wallets, directional edges represent ETH value transfers
          </p>
        </div>

        {/* Graph Controls Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#8A8A8A]">
            <span>Min:</span>
            <button
              onClick={() => setMinEthFilter(0)}
              className={`px-1.5 py-0.5 rounded ${minEthFilter === 0 ? 'bg-[#222222] text-[#F5F5F5]' : 'hover:text-[#F5F5F5]'}`}
            >
              All
            </button>
            <button
              onClick={() => setMinEthFilter(0.1)}
              className={`px-1.5 py-0.5 rounded ${minEthFilter === 0.1 ? 'bg-[#222222] text-[#8A7CFF]' : 'hover:text-[#F5F5F5]'}`}
            >
              &gt;0.1
            </button>
            <button
              onClick={() => setMinEthFilter(0.5)}
              className={`px-1.5 py-0.5 rounded ${minEthFilter === 0.5 ? 'bg-[#222222] text-[#35D07F]' : 'hover:text-[#F5F5F5]'}`}
            >
              &gt;0.5
            </button>
          </div>

          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] text-[#8A8A8A] hover:text-[#F5F5F5]"
            title="Reset Graph Zoom & Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Visualization Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[460px] rounded-lg bg-[#050505] border border-[rgba(255,255,255,0.06)] overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 p-2.5 rounded-lg bg-[#0B0B0B]/90 backdrop-blur-sm border border-[rgba(255,255,255,0.08)] text-[11px] font-mono space-y-1.5 pointer-events-none text-[#8A8A8A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F1F1F] border border-white/20"></span>
            <span>Standard Wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#8A7CFF] border border-[#B6ADFF]"></span>
            <span className="text-[#8A7CFF]">Repeated Transactor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#35D07F]"></span>
            <span className="text-[#35D07F]">Tracked Wallet</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-3 right-3 max-w-xs w-full p-4 rounded-xl bg-[#0B0B0B]/95 backdrop-blur-md border border-[rgba(255,255,255,0.12)] shadow-2xl space-y-2 text-xs font-mono animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
              <span className="text-[#8A7CFF] font-semibold">Node Details</span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#8A8A8A] hover:text-[#F5F5F5]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[#F5F5F5] break-all select-all font-medium">
              {selectedNode.id}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded bg-[#111111] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#8A8A8A]">Transactions</div>
                <div className="text-[#F5F5F5] font-semibold">{selectedNode.txCount}</div>
              </div>
              <div className="p-2 rounded bg-[#111111] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#8A8A8A]">Counterparties</div>
                <div className="text-[#F5F5F5] font-semibold">{selectedNode.counterparties.length}</div>
              </div>
              <div className="p-2 rounded bg-[#111111] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#8A8A8A]">Total Sent</div>
                <div className="text-[#F5B84B] font-semibold">{selectedNode.totalSentEth.toFixed(3)} ETH</div>
              </div>
              <div className="p-2 rounded bg-[#111111] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#8A8A8A]">Total Recv</div>
                <div className="text-[#35D07F] font-semibold">{selectedNode.totalReceivedEth.toFixed(3)} ETH</div>
              </div>
            </div>

            {selectedNode.id !== 'contract_creation' && (
              <button
                onClick={() => {
                  onTrackWallet(selectedNode.id);
                  setSelectedNode(null);
                }}
                className="w-full mt-2 py-1.5 rounded-lg bg-[#8A7CFF] hover:bg-[#7968FF] text-black font-semibold text-center transition-colors"
              >
                Track in Observatory
              </button>
            )}
          </div>
        )}
      </div>

      <div className="text-[11px] font-mono text-[#8A8A8A] flex items-center justify-between">
        <span>Tip: Drag nodes to rearrange • Scroll to zoom • Click edges to inspect EVM records</span>
        <span className="text-[#555555]">{nodes.length} Nodes • {links.length} Edges</span>
      </div>
    </div>
  );
};
